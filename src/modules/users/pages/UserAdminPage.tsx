import React, { useState } from "react";
import Sidebar from "../../core/components/layout/Sidebar";
import { DataTable } from "../../core/components/ui/data-table";
import { userAdminColumns, UserAdmin } from "../components/columns/user-admin-columns";
import { Button } from "../../core/components/ui/button";
import { UserCreateModal } from "../components/UserCreateModal";

const adminData: UserAdmin[] = [];

const UserAdminPage = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleUserCreated = (userData: any) => {
        console.log("Usuario creado:", userData);
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col bg-green-50">
                <div className="flex justify-center items-center py-8">
                    <h1 className="text-2xl font-bold text-green-900">Gestión de Administradores</h1>
                </div>
                <div className="flex justify-end px-8 mb-6">
                    <Button variant="destructive" onClick={() => setModalOpen(true)}>
                        Crear usuario
                    </Button>
                </div>
                <div className="px-8">
                    <DataTable columns={userAdminColumns} data={adminData} />
                </div>
                <UserCreateModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmitSuccess={handleUserCreated}
                />
            </main>
        </div>
    );
};

export default UserAdminPage;