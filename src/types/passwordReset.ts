// POST /auth/forgot-password
export interface ForgotPasswordRequest {
    email: string;
}

// POST /auth/reset-password
export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}
