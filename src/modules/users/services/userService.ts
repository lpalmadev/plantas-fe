import { User, CreateUserDTO, Role } from "../types";

const API_URL = "https://jardindeploy.onrender.com";

const getAuthToken = (): string => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || '';
    }
    return '';
};

const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
    };
};

export const userService = {
    getAllUsers: async (): Promise<User[]> => {
        try {
            const response = await fetch(`${API_URL}/admin/users`, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener los usuarios");
            }

            const result = await response.json();
            return result.admins || [];
        } catch (error) {
            console.error("Error en getAllUsers:", error);
            throw error;
        }
    },

    createUser: async (userData: CreateUserDTO): Promise<User> => {
        try {
            const response = await fetch(`${API_URL}/admin/users`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el usuario");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en createUser:", error);
            throw error;
        }
    },

    getAllRoles: async (): Promise<Role[]> => {
        try {
            const response = await fetch(`${API_URL}/roles`, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener los roles");
            }

            const result = await response.json();
            return result.data.roles || [];
        } catch (error) {
            console.error("Error en getAllRoles:", error);
            throw error;
        }
    },
};