import { useMutation } from "@tanstack/react-query";
import { loginAdminService } from "../services/loginAdminService";
import { useAuthStore } from "../states/authStore";
import type { LoginResponse } from "../lib/types";

export const useAuth = () => {
    const { setAuthState, clearAuth } = useAuthStore();

    const mutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const data = await loginAdminService(email, password);
            setAuthState(data);
            return data;
        }
    });

    const login = async (email: string, password: string) => {
        await mutation.mutateAsync({ email, password });
    };

    const logout = () => {
        clearAuth();
    };

    return {
        login,
        logout,
        loading: mutation.isLoading,
        error: mutation.error ? (mutation.error as Error).message : null,
        reset: mutation.reset,
    };
};