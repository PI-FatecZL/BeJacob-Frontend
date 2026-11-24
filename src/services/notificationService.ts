import { api } from "../api/api";
import type { NotificationResponse } from "../types/notification";
import type { SpringPage } from "../types/pagination";

export const notificationService = {
    findAll: async (page = 0, size = 10, sort = "createdAt,desc"): Promise<SpringPage<NotificationResponse>> => {
        const response = await api.get<SpringPage<NotificationResponse>>("/notifications", {
            params: {
                page,
                size,
                sort
            }
        });
        return response.data;
    },

    countUnread: async (): Promise<number> => {
        const response = await api.get<number>("/notifications/unread-count");
        return response.data;
    },

    markAsRead: async (id: number): Promise<NotificationResponse> => {
        const response = await api.patch<NotificationResponse>(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async (): Promise<void> => {
        await api.patch("/notifications/read-all");
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/notifications/${id}`);
    }
};
