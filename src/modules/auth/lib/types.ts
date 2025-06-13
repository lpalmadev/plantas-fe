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