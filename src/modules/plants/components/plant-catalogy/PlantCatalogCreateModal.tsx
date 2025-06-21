"use client";

import { useState } from "react";
import { Button } from "../../../core/components/ui/button";
import { Input } from "../../../core/components/ui/input";

interface PlantCatalogCreateModalProps {
    open: boolean;
    onClose: () => void;
    isDark?: boolean;
}

export function PlantCatalogCreateModal({
                                            open,
                                            onClose,
                                            isDark = false
                                        }: PlantCatalogCreateModalProps) {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSubmitConfirm(true);
    };

    const handleCancel = () => {
        setShowCancelConfirm(true);
    };

    const confirmCancel = () => {
        setShowCancelConfirm(false);
        onClose();
    };

    const confirmSubmit = () => {
        setShowSubmitConfirm(false);
        console.log("Planta agregada - MAQUETADO");
        onClose();
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                {/* Modal */}
                <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}>
                    <div className="border-b p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Agregar Planta</h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Carrusel de imágenes de la planta</h3>
                            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                                isDark ? 'border-gray-600' : 'border-gray-300'
                            }`}>
                                <div className="text-6xl mb-4">📷</div>
                                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Selecciona o arrastra 5 fotografías para añadir al carrusel de imágenes
                                </p>
                                <Button type="button" variant="outline">
                                    Seleccionar imágenes
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                🌱 Nombre de la planta
                            </h3>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Nombre de la planta
                            </p>
                            <Input
                                placeholder="Ejemplo..."
                                required
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                📊 Datos generales
                            </h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Tipo</label>
                                <Input placeholder="Seleccione..." required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Temperatura mínima</label>
                                    <div className="flex">
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            className="rounded-r-none"
                                            required
                                        />
                                        <div className={`flex items-center px-3 border-l-0 border rounded-r-md ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'
                                        }`}>
                                            °C
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Temperatura máxima</label>
                                    <div className="flex">
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            className="rounded-r-none"
                                            required
                                        />
                                        <div className={`flex items-center px-3 border-l-0 border rounded-r-md ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'
                                        }`}>
                                            °C
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Nivel de humedad</label>
                                    <select
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value="low">Nivel bajo (20% - 30%)</option>
                                        <option value="medium">Nivel medio (40% - 50%)</option>
                                        <option value="high">Nivel alto (60% - 70%)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                🧬 Taxonomía
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Familia</label>
                                    <select
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="1">Rosaceae</option>
                                        <option value="2">Solanaceae</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Género</label>
                                    <select
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="1">Rosa</option>
                                        <option value="2">Solanum</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Especie</label>
                                    <select
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="1">Rosa canina</option>
                                        <option value="2">Solanum lycopersicum</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                📝 Descripción
                            </h3>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Descripción
                            </p>
                            <textarea
                                placeholder="Ejemplo..."
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md resize-none ${
                                    isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                }`}
                                required
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                ⚠️ Advertencias
                            </h3>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Advertencia (opcional)
                            </p>
                            <textarea
                                placeholder="Ejemplo..."
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-md resize-none ${
                                    isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                }`}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit">
                                Aceptar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                    <div className={`max-w-md w-full rounded-lg p-6 ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                    }`}>
                        <h3 className="text-lg font-semibold mb-4">¿Seguro que desea cancelar?</h3>
                        <p className="text-sm mb-6">¿Seguro que desea cancelar el agregar la planta?</p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowCancelConfirm(false)}
                            >
                                No
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmCancel}
                            >
                                Sí, cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showSubmitConfirm && (
                <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                    <div className={`max-w-md w-full rounded-lg p-6 ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                    }`}>
                        <h3 className="text-lg font-semibold mb-4">¿Confirmar agregar planta?</h3>
                        <p className="text-sm mb-6">¿Desea añadir los datos de la planta a la base de datos para que sea visible para los usuarios de la aplicación móvil?</p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowSubmitConfirm(false)}
                            >
                                No
                            </Button>
                            <Button onClick={confirmSubmit}>
                                Sí, agregar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}