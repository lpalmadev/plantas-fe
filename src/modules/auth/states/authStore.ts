import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LoginResponse } from '../lib/types';
import { setAuthToken, setUserType, removetoken, removetype } from '../../core/utils/UtilsFuntions';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    userType: string | null;

    setAuthState: (data: LoginResponse) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
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
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);