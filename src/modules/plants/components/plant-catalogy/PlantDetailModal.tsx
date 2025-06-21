"use client";

import { Button } from "../../../core/components/ui/button";

interface Plant {
    id: string;
    name: string;
    scientificName: string;
    type: string;
    tempMin: number;
    tempMax: number;
    humidityLevel: string;
    family: string;
    genus: string;
    species: string;
    image: string;
    description?: string;
    alerts?: string;
}

interface PlantDetailModalProps {
    plant: Plant | null;
    open: boolean;
    onClose: () => void;
    isDark?: boolean;
}

export function PlantDetailModal({ plant, open, onClose, isDark = false }: PlantDetailModalProps) {
    if (!open || !plant) return null;

    const getHumidityLabel = (level: string) => {
        const levels: { [key: string]: string } = {
            'Low': 'Nivel bajo (20% - 30%)',
            'Low_medium': 'Nivel bajo-medio (30% - 40%)',
            'Medium': 'Nivel medio (40% - 50%)',
            'Medium_high': 'Nivel medio-alto (50% - 60%)',
            'High': 'Nivel alto (60% - 70%)'
        };
        return levels[level] || level;
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}>
                <div className="border-b p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Detalle de la Planta</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                            <img
                                src={plant.image}
                                alt={plant.name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                        <div className="md:w-2/3 space-y-4">
                            <div>
                                <h3 className={`text-2xl font-bold flex items-center gap-2 ${
                                    isDark ? 'text-green-400' : 'text-green-900'
                                }`}>
                                    🌱 {plant.name}
                                </h3>
                                {plant.scientificName && (
                                    <p className={`text-lg italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {plant.scientificName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    📊 Datos generales
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500">🔸</span>
                                        <span><strong>Tipo:</strong> {plant.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-500">🌡️</span>
                                        <span><strong>Temperatura:</strong> {plant.tempMin}°C - {plant.tempMax}°C</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-500">💧</span>
                                        <span><strong>Humedad:</strong> {getHumidityLabel(plant.humidityLevel)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            🧬 Taxonomía
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <strong>Familia:</strong> {plant.family}
                            </div>
                            <div>
                                <strong>Género:</strong> {plant.genus}
                            </div>
                            <div>
                                <strong>Especie:</strong> {plant.species}
                            </div>
                        </div>
                    </div>

                    {plant.description && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                📝 Descripción
                            </h4>
                            <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                {plant.description}
                            </p>
                        </div>
                    )}

                    {plant.alerts && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                ⚠️ Advertencias
                            </h4>
                            <p className={`p-3 rounded-lg ${
                                isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                            }`}>
                                {plant.alerts}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}