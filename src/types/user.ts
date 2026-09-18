export interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface RegisterUserResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// resposta de login com token a ser armazenado no localStorage
export interface DataToken {
    tokenJWT: string;
    id: number;
    email: string;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
}