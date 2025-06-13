import { useState } from "react";
import { loginAdminService } from "../services/loginAdminService";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        setError(null);
        setLoading(true);

        try {
            const data = await loginAdminService(email, password);
            return data;
        } catch (err: any) {
            console.error("Error en login:", err);
            setError(err.message || "Ocurrió un error de autenticación");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("type");
    };

    return {
        login,
        logout,
        loading,
        error
    };
};