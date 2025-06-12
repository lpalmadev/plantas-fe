import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/modules/core/components/ui/button"
import { Switch } from "@/modules/core/components/ui/switch"
import * as React from "react"

export type UserAdmin = {
    id: string
    nombres: string
    apellidos: string
    correo: string
    rol: string
    estado: boolean
}

export const userAdminColumns: ColumnDef<UserAdmin>[] = [
    {
        accessorKey: "nombres",
        header: "Nombre(s)",
    },
    {
        accessorKey: "apellidos",
        header: "Apellido(s)",
    },
    {
        accessorKey: "correo",
        header: "Correo",
    },
    {
        accessorKey: "rol",
        header: "Rol",
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.original.estado
            const [isActive, setIsActive] = React.useState(estado)

            const handleToggle = () => {
                setIsActive(!isActive)
            }

            return (
                <Switch checked={isActive} onCheckedChange={handleToggle} />
            )
        },
    },
]