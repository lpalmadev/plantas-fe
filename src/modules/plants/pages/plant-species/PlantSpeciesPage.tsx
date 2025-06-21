"use client";

import { useState } from "react";
import Sidebar from "../../../core/components/layout/sidebar/pages/Sidebar";
import { DataTable } from "../../../core/components/ui/data-table";
import { createPlantSpeciesColumns } from "../../components/plant-species/PlantSpeciesColumns";
import { Button } from "../../../core/components/ui/button";
import { PlantSpeciesCreateModal } from "../../components/plant-species/PlantSpeciesCreateModal";
import { PlantSpecies, CreatePlantSpeciesDTO } from "../../lib/plant-species/types";
import { useThemeStore } from "../../../core/states/themeStore";

const mockPlantSpecies: PlantSpecies[] = [
    {
        id: "1",
        name: "Rosa gallica",
        description: "Especie de rosa nativa de Europa, conocida como rosa francesa",
        created_date: "2025-01-15T10:30:00Z"
    }
];

export default function SpeciesFamilyPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [species, setSpecies] = useState<PlantSpecies[]>(mockPlantSpecies);
    const [isLoading] = useState(false);

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleEdit = (speciesId: string) => {
        console.log("Editar especie:", speciesId);
    };

    const handleDelete = (speciesId: string) => {
        console.log("Eliminar especie:", speciesId);
        setSpecies(prev => prev.filter(s => s.id !== speciesId));
    };

    const handleSpeciesCreated = async (speciesData: CreatePlantSpeciesDTO) => {
        console.log("Crear especie:", speciesData);

        const newSpecies: PlantSpecies = {
            id: Date.now().toString(),
            ...speciesData,
            created_date: new Date().toISOString()
        };

        setSpecies(prev => [...prev, newSpecies]);
        setModalOpen(false);
    };

    const columns = createPlantSpeciesColumns(handleEdit, handleDelete, isDark);

    return (
        <div className={`flex h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <Sidebar />
            <main className={`flex-1 flex flex-col ${isDark ? 'bg-gray-800' : 'bg-green-50'}`}>
                <div className="flex justify-center items-center py-8">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-900'}`}>
                        Especies de Plantas
                    </h1>
                </div>

                <div className="flex justify-end px-8 mb-6">
                    <Button
                        variant={isDark ? "outline" : "default"}
                        onClick={() => setModalOpen(true)}
                        className={isDark ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : ""}
                    >
                        Crear Especie
                    </Button>
                </div>

                <div className="px-8 flex-1">
                    {isLoading ? (
                        <div className={`flex justify-center py-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Cargando...
                        </div>
                    ) : (
                        <div className={`${isDark ? 'text-white' : ''}`}>
                            <DataTable
                                columns={columns}
                                data={species}
                            />
                        </div>
                    )}
                </div>

                <PlantSpeciesCreateModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmitSuccess={handleSpeciesCreated}
                    isDark={isDark}
                />
            </main>
        </div>
    );
}