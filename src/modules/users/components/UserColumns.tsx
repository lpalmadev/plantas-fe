"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../types";

export const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "lastname",
        header: "Apellido",
    },
    {
        accessorKey: "email",
        header: "Correo",
    },
    {
        accessorKey: "role",
        header: "Rol",
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.status;
            const isActive = status === "Active";

            return (
                <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                    isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
          <span className={`w-2 h-2 rounded-full mr-1 ${
              isActive ? "bg-green-500" : "bg-red-500"
          }`}></span>
                    {isActive ? "Activo" : "Inactivo"}
                </div>
            );
        },
    },
];