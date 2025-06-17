import { Role, CreateRoleDTO } from "../lib/types";
import { Module } from "../../module/lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { getHeaders } from "../../core/utils/UtilsFuntions";

export const roleService = {
    getAllRoles: async (): Promise<Role[]> => {
        const response = await fetch(API_ENDPOINTS.ROLES, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener los roles");
        const result = await response.json();
        return result.data.roles;
    },

    createRole: async (roleData: CreateRoleDTO): Promise<Role> => {
        const response = await fetch(API_ENDPOINTS.ROLES, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(roleData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al crear el rol");
        }
        return await response.json();
    },

    getAllModules: async (): Promise<Module[]> => {
        const response = await fetch(API_ENDPOINTS.MODULE, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener los módulos");
        return await response.json();
    },
};