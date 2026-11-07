import { isAxiosError } from "axios";
import { api } from "../api/api";
import type { ForgotPasswordRequest, ResetPasswordRequest } from "../types/passwordReset";

export class TokenRedefinicaoInvalidoError extends Error {
    constructor() {
        super("Token de redefinição de senha inválido ou expirado.");
        this.name = "TokenRedefinicaoInvalidoError";
    }
}

export class SenhaRejeitadaError extends Error {
    constructor() {
        super("A nova senha não foi aceita pelo servidor.");
        this.name = "SenhaRejeitadaError";
    }
}

const obterStatus = (error: unknown): number | undefined => {
    return isAxiosError(error) ? error.response?.status : undefined;
};

export const passwordResetService = {
    requestReset: async (dados: ForgotPasswordRequest): Promise<void> => {
        await api.post("/auth/forgot-password", dados);
    },


    validateResetToken: async (token: string, signal?: AbortSignal): Promise<void> => {
        try {
            await api.get("/auth/validate-reset-token", { params: { token }, signal });
        } catch (error) {
            const status = obterStatus(error);

            if (status === 400 || status === 401) {
                throw new TokenRedefinicaoInvalidoError();
            }

            throw error;
        }
    },


    resetPassword: async (dados: ResetPasswordRequest): Promise<void> => {
        try {
            await api.post("/auth/reset-password", dados);
        } catch (error) {
            const status = obterStatus(error);

            if (status === 401) {
                throw new TokenRedefinicaoInvalidoError();
            }

            if (status === 400) {
                throw new SenhaRejeitadaError();
            }

            throw error;
        }
    }
}
