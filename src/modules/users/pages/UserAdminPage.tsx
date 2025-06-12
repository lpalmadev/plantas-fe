import React from "react";
import Sidebar from "../../core/components/layout/Sidebar";
import { DataTable } from "../../core/components/ui/data-table";
import { userAdminColumns, UserAdmin } from "../components/columns/user-admin-columns";

const adminData: UserAdmin[] = [];

const UserAdminPage = () => {

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col bg-green-50">
                <div className="flex justify-center items-center py-8">
                    <h1 className="text-2xl font-bold text-green-900">Gestión de Administradores</h1>
                </div>
                <div className="flex justify-end px-8 mb-6">
                    <button className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-lg shadow">
                        Crear usuario
                    </button>
                </div>
                <div className="px-8">
                    <DataTable columns={userAdminColumns} data={adminData} />
                </div>
            </main>
        </div>
    );
};

export default UserAdminPage;