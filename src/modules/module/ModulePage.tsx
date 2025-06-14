"use client";

import { useState } from "react";
import Sidebar from "../core/components/layout/sidebar";
import { DataTable } from "../core/components/ui/data-table";
import { createModuleColumns } from "./components/ModuleColumns";
import { Button } from "../core/components/ui/button";
import { ModuleCreateModal } from "./components/ModuleCreateModal";
import { useModules } from "./hooks/useModules";
import { CreateModuleDTO } from "./types";

export default function ModulePage() {
    const [modalOpen, setModalOpen] = useState(false);
    const { modules, isLoading, error, createModule, toggleModuleStatus } = useModules();

    const columns = createModuleColumns(toggleModuleStatus);

    const handleModuleCreated = async (moduleData: CreateModuleDTO) => {
        try {
            await createModule(moduleData);
        } catch (error) {
            console.error("Error al crear módulo:", error);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col bg-green-50">
                <div className="flex justify-center items-center py-8">
                    <h1 className="text-2xl font-bold text-green-900">Gestión de Módulos</h1>
                </div>
                <div className="flex justify-end px-8 mb-6">
                    <Button variant="default" onClick={() => setModalOpen(true)}>
                        Crear Módulo
                    </Button>
                </div>
                <div className="px-8">
                    {isLoading ? (
                        <div className="flex justify-center py-8">Cargando...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8">{error}</div>
                    ) : (
                        <DataTable columns={columns} data={modules} />
                    )}
                </div>
                <ModuleCreateModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmitSuccess={handleModuleCreated}
                />
            </main>
        </div>
    );
}
//Arreglar eso