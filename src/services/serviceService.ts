import { api } from "../api/api";
import type { ServiceRequest, ServiceResponse } from "../types/service";

export const serviceService = {
    // adicionar serviço
    create: async (dados: ServiceRequest): Promise<ServiceResponse> => {
        const response = await api.post<ServiceResponse>('/services', dados);
        return response.data;
    },

    // buscar todos os serviços
    findAll: async (): Promise<ServiceResponse[]> => {
        const response = await api.get<ServiceResponse[]>('/services');
        return response.data;
    },

    // buscar serviço por id
    findById: async (id: number): Promise<ServiceResponse> => {
        const response = await api.get<ServiceResponse>(`/services/${id}`);
        return response.data;
    },

    // atualizar serviço
    update: async (id: number, dados: Partial<ServiceRequest>): Promise<ServiceResponse> => {
        const response = await api.patch<ServiceResponse>(`/services/${id}`, dados);
        return response.data;
    },

    // excluir serviço
    delete: async (id: number): Promise<void> => {
        await api.delete(`/services/${id}`);
    }
};