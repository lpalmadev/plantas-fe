import React, { createContext, useContext, useState, ReactNode } from "react";
import { LoginResponse } from "../lib/types";
import { getUserType, isAuthenticated as checkIsAuthenticated } from "../utils/authUtils";

interface AuthContextType {
    isAuthenticated: boolean;
    userType: string | null;
    setAuthState: (data: LoginResponse) => void;
    clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkIsAuthenticated());
    const [userType, setUserType] = useState<string | null>(getUserType());

    const setAuthState = (data: LoginResponse) => {
        if (data.token) {
            setIsAuthenticated(true);
            setUserType(data.user?.type || null);
        }
    };

    const clearAuth = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        setIsAuthenticated(false);
        setUserType(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userType, setAuthState, clearAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext debe ser usado dentro de un AuthProvider");
    }
    return context;
};