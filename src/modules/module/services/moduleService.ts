import { Module, CreateModuleDTO } from "../types";

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

export const moduleService = {
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

    createModule: async (moduleData: CreateModuleDTO): Promise<Module> => {
        try {
            const response = await fetch(`${API_URL}/modules`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(moduleData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el módulo");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en createModule:", error);
            throw error;
        }
    },

    activateModule: async (moduleId: string): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/modules/${moduleId}/activate`, {
                method: "PUT",
                headers: getHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al activar el módulo");
            }
        } catch (error) {
            console.error("Error en activateModule:", error);
            throw error;
        }
    },

    deactivateModule: async (moduleId: string): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/modules/${moduleId}/deactivate`, {
                method: "PUT",
                headers: getHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al desactivar el módulo");
            }
        } catch (error) {
            console.error("Error en deactivateModule:", error);
            throw error;
        }
    },
};