"use client";

import { useState, useEffect } from "react";
import { User, CreateUserDTO, Role } from "../types";
import { userService } from "../services/userService";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsersAndRoles();
    }, []);

    const fetchUsersAndRoles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [usersData, rolesData] = await Promise.all([
                userService.getAllUsers(),
                userService.getAllRoles()
            ]);

            setUsers(usersData);
            setRoles(rolesData);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al cargar datos";
            setError(errorMessage);
            console.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const createUser = async (userData: CreateUserDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const newUser = await userService.createUser(userData);

            const roleName = roles.find(role => role.id === userData.roleId)?.name || "Desconocido";

            setUsers(prevUsers => [...prevUsers, {
                ...newUser,
                role: roleName,
                status: "Active"
            }]);

            return newUser;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al crear el usuario";
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        users,
        roles,
        isLoading,
        error,
        fetchUsers: fetchUsersAndRoles,
        createUser,
    };
}