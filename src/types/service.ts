export interface ServiceRequest {
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
    active: boolean;
}

export interface ServiceResponse {
    id: number;
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
    active: boolean;
}

export interface UpdateServiceRequest {
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
    active: boolean;
}