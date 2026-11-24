import { api } from '../api/api';
import type { RevenueResponse } from '../types/statistics'; 

export const statisticService = {
    getRevenue: async (startDate: string, endDate: string): Promise<RevenueResponse> => {
        // Passa o tipo global na requisição do axios
        const response = await api.get<RevenueResponse>('/statistics/revenue', {
            params: { startDate, endDate }
        });
        return response.data;
    },

    downloadReport: async (startDate: string, endDate: string): Promise<void> => {
        const response = await api.get('/statistics/report', {
            params: { startDate, endDate },
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        
        const url = window.URL.createObjectURL(blob);
        
        window.open(url, '_blank');

        setTimeout(() => window.URL.revokeObjectURL(url), 100);
    }
};
