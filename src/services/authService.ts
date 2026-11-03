import { api } from "../api/api";
import type { DataToken, LoginRequest, RegisterUserRequest, UserResponse } from "../types/user";

export const authService = {
    login: async(dados: LoginRequest): Promise<DataToken> => {
        const response = await api.post<DataToken>('/auth/login', dados);

        if (response.data && response.data.tokenJWT) {
            localStorage.setItem("token", response.data.tokenJWT);
            localStorage.setItem("role", response.data.role);
        }

        return response.data;
    },

    register: async(dados: RegisterUserRequest): Promise<string> => {
        const response = await api.post<string>('/auth/register', dados);

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
        localStorage.removeItem("role");
    },

    getToken(): string | null {
        return localStorage.getItem("token");
    },

    getUserRole(): string | null {
        return localStorage.getItem("role");
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem("token");
    },

    getMe: async(): Promise<UserResponse> => {
        const token = authService.getToken(); 
        
        const response = await api.get<UserResponse>('/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    },

    updateMe: async (dados: { name: string; phone: string; email: string }): Promise<UserResponse> => {
        const token = authService.getToken();

        const response = await api.patch<UserResponse>('/auth/me', dados, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    }
}