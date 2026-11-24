import { isAxiosError } from "axios";
import { api } from "../api/api";
import type { ForgotPasswordRequest, ResetPasswordRequest } from "../types/passwordReset";

export class TokenRedefinicaoInvalidoError extends Error {
    constructor() {
        super("Token de redefinição inválido ou expirado.");
        this.name = "TokenRedefinicaoInvalidoError";
    }
}

export class SenhaRejeitadaError extends Error {
    constructor() {
        super("A nova senha não foi aceita pelo servidor.");
        this.name = "SenhaRejeitadaError";
    }
}

// O status 400 também pode representar validação ou outro erro.
// Não presumimos que toda resposta 400 seja um problema de senha.
export class RequisicaoRedefinicaoInvalidaError extends Error {
    constructor() {
        super("Não foi possível concluir a redefinição. Verifique os dados e solicite outro link se necessário.");
        this.name = "RequisicaoRedefinicaoInvalidaError";
    }
}

const obterMensagem = (error: unknown): string => {
    if (!isAxiosError(error)) return "";
    const data: unknown = error.response?.data;
    if (typeof data === "string") return data;
    if (typeof data === "object" && data !== null) {
        const item = data as Record<string, unknown>;
        for (const campo of ["message", "mensagem", "detail", "error"]) {
            if (typeof item[campo] === "string") return item[campo];
        }
    }
    return "";
};

export const passwordResetService = {
    requestReset: async (dados: ForgotPasswordRequest): Promise<void> => {
        await api.post("/auth/forgot-password", dados);
    },

    validateResetToken: async (token: string, signal?: AbortSignal): Promise<void> => {
        try {
            await api.get("/auth/validate-reset-token", { params: { token }, signal });
        } catch (error) {
            if (isAxiosError(error) &&
                (error.response?.status === 400 || error.response?.status === 401)) {
                throw new TokenRedefinicaoInvalidoError();
            }
            throw error;
        }
    },

    resetPassword: async (dados: ResetPasswordRequest): Promise<void> => {
        try {
            await api.post("/auth/reset-password", dados);
        } catch (error) {
            if (!isAxiosError(error)) throw error;

            const status = error.response?.status;
            if (status === 401) throw new TokenRedefinicaoInvalidoError();

            if (status === 400) {
                // Classificação conservadora baseada APENAS em mensagens explícitas.
                // Mensagens não reconhecidas recebem um erro genérico, não de senha.
                const mensagem = obterMensagem(error).toLocaleLowerCase("pt-BR");
                if (/token|jwt|expirad|inválid.*link|malformad/.test(mensagem)) {
                    throw new TokenRedefinicaoInvalidoError();
                }
                if (/senha|password/.test(mensagem)) {
                    throw new SenhaRejeitadaError();
                }
                throw new RequisicaoRedefinicaoInvalidaError();
            }
            throw error;
        }
    }
};
