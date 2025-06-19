import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LoginResponse } from '../../auth/lib/types.ts';
import { setAuthToken, setUserType, removetoken, removetype, getAuthToken, getUserType } from '../utils/UtilsFuntions.ts';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    userType: string | null;

    setAuthState: (data: LoginResponse) => void;
    clearAuth: () => void;
    validateToken: () => void;
    initializeAuth: () => void;
}

const isTokenValid = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp > currentTime;
    } catch (error) {
        console.warn('Token validation failed:', error);
        return false;
    }
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            token: null,
            userType: null,

            setAuthState: (data: LoginResponse) => {
                if (data.token) {
                    setAuthToken(data.token);
                    if (data.user?.type) setUserType(data.user.type);

                    set({
                        isAuthenticated: true,
                        token: data.token,
                        userType: data.user?.type || null
                    });
                }
            },

            clearAuth: () => {
                removetoken();
                removetype();
                set({
                    isAuthenticated: false,
                    token: null,
                    userType: null
                });
            },

            validateToken: () => {
                const currentToken = get().token || getAuthToken();

                if (!currentToken) {
                    get().clearAuth();
                    return;
                }

                if (!isTokenValid(currentToken)) {
                    get().clearAuth();
                    return;
                }

                if (!get().isAuthenticated) {
                    set({
                        isAuthenticated: true,
                        token: currentToken,
                        userType: getUserType()
                    });
                }
            },

            initializeAuth: () => {
                const token = getAuthToken();
                const userType = getUserType();

                if (token && isTokenValid(token)) {
                    set({
                        isAuthenticated: true,
                        token,
                        userType
                    });
                } else {
                    get().clearAuth();
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);