import { useLoginMutation } from "./mutations/useLoginMutation";
import { useLogoutMutation } from "./mutations/useLogoutMutation";

export const useAuth = () => {
    const loginMutation = useLoginMutation();
    const logoutMutation = useLogoutMutation();

    const login = async (email: string, password: string) => {
        await loginMutation.mutateAsync({ email, password });
    };

    const logout = () => {
        logoutMutation.mutate();
    };

    return {
        login,
        loginLoading: loginMutation.isPending,
        loginError: loginMutation.error?.message || null,
        resetLoginError: loginMutation.reset,

        logout,
        logoutLoading: logoutMutation.isPending,
        logoutError: logoutMutation.error?.message || null,
        resetLogoutError: logoutMutation.reset,
    };
};