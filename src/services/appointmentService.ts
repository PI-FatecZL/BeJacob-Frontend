import { api } from "../api/api";
import type { AppointmentResponse, CancelAppointmentRequest, CreateAppointmentAdminRequest, CreateAppointmentRequest, UpdateAppointmentRequest } from "../types/appointment";
import type { SpringPage } from "../types/pagination";

export const appointmentService = {
    // adicionar agendamento
    create: async (dados: CreateAppointmentRequest): Promise<AppointmentResponse> => {
        const response = await api.post<AppointmentResponse>('/appointments', dados);
        return response.data;
    },

    // adicionar agendamento (admin)
    createAdmin: async (dados: CreateAppointmentAdminRequest): Promise<AppointmentResponse> => {
        const response = await api.post<AppointmentResponse>('/appointments/admin', dados);
        return response.data;
    },

    // consultar horários disponíveis
    getAvailableTimes: async (date: string, serviceId: number): Promise<string[]> => {
        const response = await api.get<string[]>('/appointments/availability', {
            params: {
                date,      
                serviceId
            }
        });
        return response.data;
    },

    // listar agendamentos (admin)
    findAll: async (page = 0, size = 10, sort = 'startsAt', date?: string): Promise<SpringPage<AppointmentResponse>> => {
        const response = await api.get<SpringPage<AppointmentResponse>>('/appointments', {
            params: {
                page,
                size,
                sort,
                ...(date && { date }) // Se passar a data opcional, adiciona no filtro
            }
        });
        return response.data;
    },

    // listar agendamentos (user)
    listMyAppointments: async (page = 0, size = 10, sort = 'startsAt'): Promise<SpringPage<AppointmentResponse>> => {
        const response = await api.get<SpringPage<AppointmentResponse>>('/appointments/me', {
            params: {
                page,
                size,
                sort
            }
        });
        return response.data;
    },

    // buscar agendamento por id
    findById: async (id: number): Promise<AppointmentResponse> => {
        const response = await api.get<AppointmentResponse>(`/appointments/${id}`);
        return response.data;
    },

    // atualizar agendamento
    update: async (id: number, dados: Partial<UpdateAppointmentRequest>): Promise<AppointmentResponse> => {
        const response = await api.patch<AppointmentResponse>(`/appointments/${id}`, dados);
        return response.data;
    },

    // cancelar agendamento
    cancel: async (id: number, dados: CancelAppointmentRequest): Promise<AppointmentResponse> => {
        const response = await api.patch<AppointmentResponse>(`/appointments/${id}/cancel`, dados);
        return response.data;
    }
}