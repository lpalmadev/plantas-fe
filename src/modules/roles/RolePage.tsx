"use client";

import { useState } from "react";
import Sidebar from "../core/components/layout/sidebar";
import { DataTable } from "../core/components/ui/data-table";
import { roleColumns } from "./components/RoleColumns";
import { Button } from "../core/components/ui/button";
import { RoleCreateModal } from "./components/RoleCreateModal";
import { useRoles } from "./hooks/useRoles";
import { CreateRoleDTO } from "./types";

export default function RolePage() {
    const [modalOpen, setModalOpen] = useState(false);
    const { roles, modules, isLoading, error, createRole } = useRoles();

    const handleRoleCreated = async (roleData: CreateRoleDTO) => {
        try {
            await createRole(roleData);
        } catch (error) {
            console.error("Error en la interfaz al crear rol:", error);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col bg-green-50">
                <div className="flex justify-center items-center py-8">
                    <h1 className="text-2xl font-bold text-green-900">Gestión de Roles</h1>
                </div>
                <div className="flex justify-end px-8 mb-6">
                    <Button variant="default" onClick={() => setModalOpen(true)}>
                        Crear Rol
                    </Button>
                </div>
                <div className="px-8">
                    {isLoading ? (
                        <div className="flex justify-center py-8">Cargando...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8">{error}</div>
                    ) : (
                        <DataTable columns={roleColumns} data={roles} />
                    )}
                </div>

                <RoleCreateModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmitSuccess={handleRoleCreated}
                    modules={modules}
                />
            </main>
        </div>
    );
}