"use client";

import { useState, useEffect } from "react";
import { Module, CreateModuleDTO } from "../types";
import { moduleService } from "../services/moduleService";

export function useModules() {
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await moduleService.getAllModules();
            setModules(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al cargar los módulos";
            setError(errorMessage);
            console.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const createModule = async (moduleData: CreateModuleDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const newModule = await moduleService.createModule(moduleData);
            setModules((prevModules) => [...prevModules, newModule]);
            return newModule;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al crear el módulo";
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const toggleModuleStatus = async (moduleId: string, activate: boolean) => {
        setIsLoading(true);
        setError(null);
        try {
            if (activate) {
                await moduleService.activateModule(moduleId);
            } else {
                await moduleService.deactivateModule(moduleId);
            }
            setModules(prevModules =>
                prevModules.map(module =>
                    module.id === moduleId ? { ...module, is_active: activate } : module
                )
            );
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : `Error al ${activate ? "activar" : "desactivar"} el módulo`;
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        modules,
        isLoading,
        error,
        fetchModules,
        createModule,
        toggleModuleStatus,
    };
}