import { Role, CreateRoleDTO } from "../types";
import { Module } from "../../module/types";

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

export const roleService = {
    getAllRoles: async (): Promise<Role[]> => {
        try {
            const response = await fetch(`${API_URL}/roles`, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener los roles");
            }

            const result = await response.json();
            return result.data.roles;
        } catch (error) {
            console.error("Error en getAllRoles:", error);
            throw error;
        }
    },

    createRole: async (roleData: CreateRoleDTO): Promise<Role> => {
        try {
            const response = await fetch(`${API_URL}/roles`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(roleData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el rol");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en createRole:", error);
            throw error;
        }
    },

    getAllModules: async (): Promise<Module[]> => {
        try {
            const response = await fetch(`${API_URL}/modules`, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error("Error al obtener los módulos");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en getAllModules:", error);
            throw error;
        }
    },
};