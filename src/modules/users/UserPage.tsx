"use client";

import { useState } from "react";
import Sidebar from "../core/components/layout/sidebar";
import { DataTable } from "../core/components/ui/data-table";
import { userColumns } from "./components/UserColumns";
import { Button } from "../core/components/ui/button";
import { UserCreateModal } from "./components/UserCreateModal";
import { useUsers } from "./hooks/useUsers";
import { CreateUserDTO } from "./types";

export default function UserPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const { users, roles, isLoading, error, createUser } = useUsers();

    const handleUserCreated = async (userData: CreateUserDTO) => {
        try {
            await createUser(userData);
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col bg-green-50">
                <div className="flex justify-center items-center py-8">
                    <h1 className="text-2xl font-bold text-green-900">Gestión de Usuarios</h1>
                </div>
                <div className="flex justify-end px-8 mb-6">
                    <Button variant="default" onClick={() => setModalOpen(true)}>
                        Crear Usuario
                    </Button>
                </div>
                <div className="px-8">
                    {isLoading ? (
                        <div className="flex justify-center py-8">Cargando...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8">{error}</div>
                    ) : (
                        <DataTable columns={userColumns} data={users} />
                    )}
                </div>

                <UserCreateModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmitSuccess={handleUserCreated}
                    roles={roles.filter(role => role.is_active)}
                />
            </main>
        </div>
    );
}