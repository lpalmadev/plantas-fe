"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CreateUserDTO, Role } from "../types";
import { Button } from "../../core/components/ui/button";

interface UserCreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmitSuccess?: (data: CreateUserDTO) => void;
    roles: Role[];
}

export function UserCreateModal({
                                    open,
                                    onClose,
                                    onSubmitSuccess,
                                    roles
                                }: UserCreateModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserDTO>();

    const onSubmit = async (data: CreateUserDTO) => {
        if (onSubmitSuccess) {
            try {
                await onSubmitSuccess(data);
                reset();
                onClose();
            } catch (error) {
                console.error("Error al crear usuario:", error);
            }
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Crear nuevo usuario</h2>
                    <button
                        className="text-gray-400 hover:text-red-500 text-xl transition-colors"
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        aria-label="Cerrar"
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Nombre */}
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

                    {/* Apellido */}
                    <div>
                        <label className="block mb-1 font-semibold text-base">Apellido</label>
                        <input
                            type="text"
                            {...register("lastname", { required: "El apellido es obligatorio" })}
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.lastname ? "border-red-400" : "border-gray-300"
                            }`}
                            autoComplete="off"
                        />
                        {errors.lastname && (
                            <span className="text-red-500 text-xs">
                {errors.lastname.message}
              </span>
                        )}
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="block mb-1 font-semibold text-base">Correo</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "El correo es obligatorio",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Correo electrónico inválido"
                                }
                            })}
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.email ? "border-red-400" : "border-gray-300"
                            }`}
                            autoComplete="off"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
                        )}
                    </div>

                    {/* Fecha de nacimiento */}
                    <div>
                        <label className="block mb-1 font-semibold text-base">Fecha de nacimiento</label>
                        <input
                            type="date"
                            {...register("birthdate", { required: "La fecha de nacimiento es obligatoria" })}
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.birthdate ? "border-red-400" : "border-gray-300"
                            }`}
                        />
                        {errors.birthdate && (
                            <span className="text-red-500 text-xs">
                {errors.birthdate.message}
              </span>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block mb-1 font-semibold text-base">Teléfono</label>
                        <input
                            type="tel"
                            {...register("phone", {
                                required: "El teléfono es obligatorio",
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Debe ser un número de 10 dígitos"
                                }
                            })}
                            placeholder="9981234567"
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.phone ? "border-red-400" : "border-gray-300"
                            }`}
                            autoComplete="off"
                        />
                        {errors.phone && (
                            <span className="text-red-500 text-xs">
                {errors.phone.message}
              </span>
                        )}
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="block mb-1 font-semibold text-base">Rol</label>
                        <select
                            {...register("roleId", { required: "Debe seleccionar un rol" })}
                            className={`w-full border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.roleId ? "border-red-400" : "border-gray-300"
                            }`}
                            defaultValue=""
                        >
                            <option value="" disabled>Seleccionar rol</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.roleId && (
                            <span className="text-red-500 text-xs">
                {errors.roleId.message}
              </span>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold transition"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creando..." : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}