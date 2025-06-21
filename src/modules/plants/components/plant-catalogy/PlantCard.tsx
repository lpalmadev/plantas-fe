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

interface PlantCardProps {
    plant: Plant;
    onViewDetail: (plant: Plant) => void;
    onEdit: (plant: Plant) => void;
    isDark?: boolean;
}

export function PlantCard({ plant, onViewDetail, onEdit, isDark = false }: PlantCardProps) {
    const getHumidityLabel = (level: string) => {
        const levels: { [key: string]: string } = {
            'Low': 'Bajo (20% - 30%)',
            'Low_medium': 'Bajo-medio (30% - 40%)',
            'Medium': 'Medio (40% - 50%)',
            'Medium_high': 'Medio-alto (50% - 60%)',
            'High': 'Alto (60% - 70%)'
        };
        return levels[level] || level;
    };

    return (
        <div className={`rounded-lg border shadow-md overflow-hidden transition-transform hover:scale-105 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${
                        isDark ? 'text-green-400' : 'text-green-900'
                    }`}>
                        🌱 Nombre de la planta: {plant.name}
                    </h3>
                    {plant.scientificName && (
                        <p className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {plant.scientificName}
                        </p>
                    )}
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-orange-500">🔸</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            <strong>Tipo:</strong> {plant.type}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-yellow-500">🌡️</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            <strong>Temperatura ideal:</strong> {plant.tempMin}°C - {plant.tempMax}°C
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-blue-500">💧</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            <strong>Nivel de humedad ideal:</strong> {getHumidityLabel(plant.humidityLevel)}
                        </span>
                    </div>
                </div>

                <div className={`text-xs space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-1">
                        <span className="text-purple-500">🧬</span>
                        <span>
                            <strong>Reino:</strong> Plantae | <strong>Familia:</strong> {plant.family} | <strong>Género:</strong> {plant.genus}
                        </span>
                    </div>
                    <div className="ml-5">
                        <strong>Especie:</strong> {plant.species}
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button
                        onClick={() => onViewDetail(plant)}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center gap-2"
                    >
                        <span>👁️</span>
                        Ver detalle
                    </Button>
                    <Button
                        onClick={() => onEdit(plant)}
                        variant="default"
                        size="sm"
                        className="flex-1 flex items-center gap-2"
                    >
                        <span>✏️</span>
                        Editar
                    </Button>
                </div>
            </div>
        </div>
    );
}