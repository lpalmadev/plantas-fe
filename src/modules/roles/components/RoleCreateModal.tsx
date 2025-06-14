"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CreateRoleDTO, PermissionType, permissionLabels, validatePermissions } from "../types";
import { Module } from "../../module/types";
import { Button } from "../../core/components/ui/button";
import { Checkbox } from "../../core/components/ui/checkbox";

interface RoleCreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmitSuccess?: (data: CreateRoleDTO) => void;
    modules: Module[];
}

export function RoleCreateModal({
                                    open,
                                    onClose,
                                    onSubmitSuccess,
                                    modules
                                }: RoleCreateModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateRoleDTO>({
        defaultValues: {
            name: "",
            description: "",
            permissions: []
        }
    });

    const [modulePermissions, setModulePermissions] = useState<Record<string, PermissionType[]>>({});

    const updateModulePermissions = (moduleId: string, permission: PermissionType, checked: boolean) => {
        setModulePermissions(prevState => {
            const currentPermissions = [...(prevState[moduleId] || [])];

            if (checked) {
                if (permission !== "READ" && !currentPermissions.includes("READ")) {
                    return {
                        ...prevState,
                        [moduleId]: [...currentPermissions, permission, "READ"]
                    };
                }
                return {
                    ...prevState,
                    [moduleId]: [...currentPermissions, permission]
                };
            } else {
                if (permission === "READ" && currentPermissions.some(p => p !== "READ")) {
                    return prevState;
                }
                return {
                    ...prevState,
                    [moduleId]: currentPermissions.filter(p => p !== permission)
                };
            }
        });
    };

    const prepareFormData = (data: any): CreateRoleDTO => {
        const permissions = Object.entries(modulePermissions)
            .filter(([_, perms]) => perms.length > 0)
            .map(([moduleId, permissions]) => ({
                module_id: moduleId,
                permissions
            }));

        return {
            name: data.name,
            description: data.description,
            permissions
        };
    };

    const onSubmit = async (data: any) => {
        const formData = prepareFormData(data);

        if (formData.permissions.length === 0) {
            alert("Debe seleccionar al menos un permiso para un módulo");
            return;
        }

        if (onSubmitSuccess) {
            try {
                await onSubmitSuccess(formData);
                reset();
                setModulePermissions({});
                onClose();
            } catch (error) {
                console.error("Error al crear rol:", error);
            }
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-4 relative max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Crear nuevo rol</h2>
                    <button
                        className="text-gray-400 hover:text-red-500 text-xl transition-colors"
                        onClick={() => {
                            reset();
                            setModulePermissions({});
                            onClose();
                        }}
                        aria-label="Cerrar"
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Información básica del rol */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold text-base">Nombre</label>
                            <input
                                type="text"
                                {...register("name", { required: "El nombre es obligatorio" })}
                                className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.name ? "border-red-400" : "border-gray-300"
                                }`}
                                autoComplete="off"
                            />
                            {errors.name && (
                                <span className="text-red-500 text-xs">
                  {errors.name.message}
                </span>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-base">Descripción</label>
                            <input
                                type="text"
                                {...register("description", {
                                    required: "La descripción es obligatoria",
                                })}
                                className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.description ? "border-red-400" : "border-gray-300"
                                }`}
                            />
                            {errors.description && (
                                <span className="text-red-500 text-xs">
                  {errors.description.message}
                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Permisos por módulo</h3>

                        <div className="border rounded-lg p-4 bg-gray-50">
                            {modules.length === 0 ? (
                                <p className="text-gray-500">No hay módulos disponibles</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {modules.map(module => (
                                        <div key={module.id} className="border-b pb-3 last:border-b-0">
                                            <h4 className="font-medium mb-2">{module.name}</h4>
                                            <div className="flex flex-wrap gap-4">
                                                {(["READ", "CREATE", "UPDATE", "DELETE"] as PermissionType[]).map(permission => {
                                                    const isChecked = modulePermissions[module.id]?.includes(permission) || false;
                                                    const isReadOnlyDisabled =
                                                        permission === "READ" &&
                                                        modulePermissions[module.id]?.some(p => p !== "READ");

                                                    return (
                                                        <label key={`${module.id}-${permission}`} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                checked={isChecked}
                                                                disabled={isReadOnlyDisabled}
                                                                onCheckedChange={(checked) => {
                                                                    updateModulePermissions(module.id, permission, checked === true);
                                                                }}
                                                            />
                                                            <span>{permissionLabels[permission]}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {errors.permissions && (
                            <span className="text-red-500 text-xs mt-1 block">
                {errors.permissions.message}
              </span>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                setModulePermissions({});
                                onClose();
                            }}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creando..." : "Crear Rol"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}