import type { ServiceResponse } from "./service";
import type { UserResponse } from "./user";

export type AppointmentStatus = "SCHEDULED" | "CANCELED" | "COMPLETED" | "NO_SHOW";

export type PaymentMethod = "PIX" | "DEBIT" | "CREDIT" | "CASH";

export interface CreateAppointmentRequest {
    serviceId: number;
    startsAt: string;
    notes: string;
    paymentMethod: PaymentMethod;
}

export interface CreateAppointmentAdminRequest {
    userId: number;
    serviceId: number;
    startsAt: string;
    notes: string;
    status: AppointmentStatus;
    paymentMethod: PaymentMethod;
}

export interface UpdateAppointmentRequest {
    serviceId?: number;
    startsAt?: string;
    notes?: string;
    status?: AppointmentStatus;
    paymentMethod?: PaymentMethod;
}

export interface AppointmentResponse {
    id: number;
    user: UserResponse;
    service: ServiceResponse;
    startsAt: string;
    endsAt: string;
    notes: string;
    status: AppointmentStatus;
    price: number;
    paymentMethod: PaymentMethod;
    cancellationReason: string;
    createdAt: string;
}

export interface CancelAppointmentRequest {
    cancellationReason: string;
}