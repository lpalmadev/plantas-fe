"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../core/components/ui/button";
import { Switch } from "../../core/components/ui/switch";
import { Module } from "../types";
import * as React from "react";


interface StatusCellProps {
    moduleId: string;
    isActive: boolean;
    onToggle: (moduleId: string, newStatus: boolean) => Promise<void>;
}

const StatusCell = ({ moduleId, isActive, onToggle }: StatusCellProps) => {
    const [isPending, setIsPending] = React.useState(false);

    const handleToggle = async () => {
        setIsPending(true);
        try {
            await onToggle(moduleId, !isActive);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex items-center">
            <Switch
                checked={isActive}
                onCheckedChange={handleToggle}
                disabled={isPending}
            />
            <span className="ml-2">{isActive ? "Activo" : "Inactivo"}</span>
        </div>
    );
};

export const createModuleColumns = (
    onToggleStatus: (moduleId: string, newStatus: boolean) => Promise<void>
): ColumnDef<Module>[] => [
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
            const { id, is_active } = row.original;
            return (
                <StatusCell
                    moduleId={id}
                    isActive={is_active}
                    onToggle={onToggleStatus}
                />
            );
        },
    },
];