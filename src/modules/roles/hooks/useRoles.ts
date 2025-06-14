"use client";

import { useState, useEffect } from "react";
import { Role, CreateRoleDTO, validatePermissions } from "../types";
import { roleService } from "../services/roleService";
import { Module } from "../../module/types";

export function useRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRolesAndModules();
    }, []);

    const fetchRolesAndModules = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [rolesData, modulesData] = await Promise.all([
                roleService.getAllRoles(),
                roleService.getAllModules()
            ]);

            setRoles(rolesData);
            setModules(modulesData);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al cargar datos";
            setError(errorMessage);
            console.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const createRole = async (roleData: CreateRoleDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const hasInvalidPermissions = roleData.permissions.some(
                modulePermission => !validatePermissions(modulePermission.permissions)
            );

            if (hasInvalidPermissions) {
                throw new Error("Si se selecciona Crear, Editar o Eliminar, el permiso Ver debe estar incluido");
            }

            const newRole = await roleService.createRole(roleData);

            setRoles(prevRoles => [...prevRoles, {
                ...newRole,
                permissions: roleData.permissions
            }]);

            return newRole;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al crear el rol";
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        roles,
        modules,
        isLoading,
        error,
        fetchRoles: fetchRolesAndModules,
        createRole,
    };
}