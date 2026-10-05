import type { ServiceResponse } from "./service";
import type { UserResponse } from "./user";

export type AppointmentStatus = "SCHEDULED" | "CANCELED" | "COMPLETED" | "NO_SHOW";

export interface CreateAppointmentRequest {
    serviceId: number;
    startsAt: string;
    notes: string;
}

export interface CreateAppointmentAdminRequest {
    userId: number;
    serviceId: number;
    startsAt: string;
    notes: string;
    status: AppointmentStatus;
}

export interface UpdateAppointmentRequest {
    serviceId: number;
    startsAt: string;
    notes: string;
    status: AppointmentStatus;
}

export interface AppointmentResponse {
    id: number;
    user: UserResponse;
    service: ServiceResponse;
    startsAt: string;
    endsAt: string;
    notes: string;
    status: AppointmentStatus;
    createdAt: string;
}