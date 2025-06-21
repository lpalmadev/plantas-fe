export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        type: string;
    };
}

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    userType: string | null;
}
export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
}