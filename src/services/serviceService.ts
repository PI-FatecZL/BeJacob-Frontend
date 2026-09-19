import type { Service, ServiceRequest } from '../types/service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token'); 
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export const serviceService = {
    async findAll(): Promise<Service[]> {
        const res = await fetch(`${API_URL}/services`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Erro ao buscar serviços');
        return res.json();
    },

    async create(data: ServiceRequest): Promise<Service> {
        const res = await fetch(`${API_URL}/services`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Erro ao criar serviço');
        return res.json();
    },

    async update(id: number, data: ServiceRequest): Promise<Service> {
        const res = await fetch(`${API_URL}/services/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Erro ao atualizar serviço');
        return res.json();
    },

    async remove(id: number): Promise<void> {
        const res = await fetch(`${API_URL}/services/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Erro ao excluir serviço');
    },
};
