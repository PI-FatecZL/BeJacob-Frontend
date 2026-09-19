import { api } from "../api/api";
import type { UserResponse } from "../types/user";

export const userService = {

    // buscar usuário por id
    findById: async (id: number): Promise<UserResponse> => {
        const response = await api.get<UserResponse>(`/users/${id}`);
        return response.data;
    }
}