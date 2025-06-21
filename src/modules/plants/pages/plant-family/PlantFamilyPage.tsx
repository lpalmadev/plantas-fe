"use client";

import { useState } from "react";
import Sidebar from "../../../core/components/layout/sidebar/pages/Sidebar";
import { DataTable } from "../../../core/components/ui/data-table";
import { createPlantFamilyColumns } from "../../components/plant-family/PlantFamilyColumns";
import { Button } from "../../../core/components/ui/button";
import { PlantFamilyCreateModal } from "../../components/plant-family/PlantFamilyCreateModal";
import { PlantFamily, CreatePlantFamilyDTO } from "../../lib/plant-family/types.ts";
import { useThemeStore } from "../../../core/states/themeStore";

const mockPlantFamilies: PlantFamily[] = [
    {
        id: "1",
        name: "Rosaceae",
        description: "Familia de plantas que incluye rosas, manzanas y fresas",
        created_date: "2025-01-15T10:30:00Z"
    }
];

export default function PlantFamilyPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [families, setFamilies] = useState<PlantFamily[]>(mockPlantFamilies);
    const [isLoading] = useState(false);

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleEdit = (familyId: string) => {
        console.log("Editar familia:", familyId);
    };

    const handleDelete = (familyId: string) => {
        console.log("Eliminar familia:", familyId);
        setFamilies(prev => prev.filter(family => family.id !== familyId));
    };

    const handleFamilyCreated = async (familyData: CreatePlantFamilyDTO) => {
        console.log("Crear familia:", familyData);

        const newFamily: PlantFamily = {
            id: Date.now().toString(),
            ...familyData,
            created_date: new Date().toISOString()
        };

        setFamilies(prev => [...prev, newFamily]);
        setModalOpen(false);
    };

    const columns = createPlantFamilyColumns(handleEdit, handleDelete, isDark);

    return (
        <div className={`flex h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <Sidebar />
            <main className={`flex-1 flex flex-col ${isDark ? 'bg-gray-800' : 'bg-green-50'}`}>
                <div className="flex justify-center items-center py-8">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-900'}`}>
                        Familia de Plantas
                    </h1>
                </div>

                <div className="flex justify-end px-8 mb-6">
                    <Button
                        variant={isDark ? "outline" : "default"}
                        onClick={() => setModalOpen(true)}
                        className={isDark ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : ""}
                    >
                        Crear Familia
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
                                data={families}
                            />
                        </div>
                    )}
                </div>

                <PlantFamilyCreateModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmitSuccess={handleFamilyCreated}
                    isDark={isDark}
                />
            </main>
        </div>
    );
}