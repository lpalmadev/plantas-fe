"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../core/components/ui/button";
import { PlantGenus } from "../../lib/plant-genus/types.ts";
import * as React from "react";

interface ActionsCellProps {
    genusId: string;
    onEdit: (genusId: string) => void;
    onDelete: (genusId: string) => void;
    isDark?: boolean;
}

const ActionsCell = ({ genusId, onEdit, onDelete, isDark }: ActionsCellProps) => {
    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(genusId)}
                className={`${isDark ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white' : 'border-green-200 hover:bg-green-50'} transition-colors`}
            >
                Editar
            </Button>
            <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(genusId)}
                className="bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
                Eliminar
            </Button>
        </div>
    );
};

export const createPlantGenusColumns = (
    onEdit: (genusId: string) => void,
    onDelete: (genusId: string) => void,
    isDark: boolean = false
): ColumnDef<PlantGenus>[] => [
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            return (
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {value}
                </span>
            );
        }
    },
    {
        accessorKey: "description",
        header: "Descripción",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            return (
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {value}
                </span>
            );
        }
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const { id } = row.original;
            return (
                <ActionsCell
                    genusId={id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDark={isDark}
                />
            );
        },
    },
];