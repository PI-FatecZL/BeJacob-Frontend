export interface NotificationResponse {
    id: number;
    appointmentId: number;
    clientName: string;
    serviceName: string;
    appointmentDate: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}