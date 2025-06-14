"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "../../core/components/ui/switch";
import { Role } from "../types";
import * as React from "react";

export const roleColumns: ColumnDef<Role>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "description",
        header: "Descripción",
    },
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => {
            const isActive = row.original.is_active;

            return (
                <div className="flex items-center">
                    <Switch checked={isActive} disabled={true} />
                    <span className="ml-2">{isActive ? "Activo" : "Inactivo"}</span>
                </div>
            );
        },
    },
];