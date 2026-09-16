import { api } from "../api/api";
import type { DataToken, LoginRequest, RegisterUserRequest, RegisterUserResponse } from "../types/user";

export const authService = {
    login: async(dados: LoginRequest): Promise<DataToken> => {
        const response = await api.post<DataToken>('/auth/login', dados);

        if (response.data && response.data.tokenJWT) {
            localStorage.setItem("token", response.data.tokenJWT);
        }

        return response.data;
    },

    register: async(dados: RegisterUserRequest): Promise<RegisterUserResponse> => {
        const response = await api.post<RegisterUserResponse>('/auth/register', dados);

        if (response.status === 200 || response.status === 201) {
            await authService.login({
                email: dados.email,
                password: dados.password
            });
        }

        return response.data;
    },

    logout(): void {
        localStorage.removeItem("token");
    },

    getToken(): string | null {
        return localStorage.getItem("token");
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem("token");
    }
}