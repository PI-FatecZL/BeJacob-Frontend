import { api } from "../api/api";
import type { SpringPage } from "../types/pagination";
import type { UserResponse } from "../types/user";

export const userService = {

    // buscar usuário por id
    findById: async (id: number): Promise<UserResponse> => {
        const response = await api.get<UserResponse>(`/users/${id}`);
        return response.data;
    },

    // listar todos os usuários
    findAll: async (page = 0, size = 10, sort = 'id'): Promise<SpringPage<UserResponse>> => {
        const response = await api.get<SpringPage<UserResponse>>('/users', {
            params: {
                page,
                size,
                sort
            }
        });
        return response.data;
    },

    // excluir um usuário
    delete: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`);
    }
}