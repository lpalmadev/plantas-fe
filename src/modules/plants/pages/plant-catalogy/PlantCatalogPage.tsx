"use client";

import { useState } from "react";
import Sidebar from "../../../core/components/layout/sidebar/pages/Sidebar";
import { Button } from "../../../core/components/ui/button";
import { Input } from "../../../core/components/ui/input";
import { PlantCatalogCreateModal } from "../../components/plant-catalogy/PlantCatalogCreateModal";
import { PlantCard } from "../../components/plant-catalogy/PlantCard";
import { PlantDetailModal } from "../../components/plant-catalogy/PlantDetailModal";
import { useThemeStore } from "../../../core/states/themeStore";

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

const mockPlants: Plant[] = [
    {
        id: "1",
        name: "Tomate de rama",
        scientificName: "Solanum lycopersicum",
        type: "Hortalizas y leguminosas",
        tempMin: 22,
        tempMax: 28,
        humidityLevel: "Medium_high",
        family: "Solanaceae",
        genus: "Solanum",
        species: "S. lycopersicum",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
        description: "El tomate es una planta herbácea de la familia de las solanáceas, muy cultivada por sus frutos comestibles.",
        alerts: "Susceptible a plagas como la mosca blanca y el pulgón."
    },
    {
        id: "2",
        name: "Rosa roja",
        scientificName: "Rosa gallica",
        type: "Plantas ornamentales",
        tempMin: 15,
        tempMax: 25,
        humidityLevel: "Medium",
        family: "Rosaceae",
        genus: "Rosa",
        species: "R. gallica",
        image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=300&fit=crop",
        description: "Rosa ornamental de color rojo intenso, muy apreciada por su fragancia.",
    },
    {
        id: "3",
        name: "Albahaca",
        scientificName: "Ocimum basilicum",
        type: "Hierbas aromáticas",
        tempMin: 20,
        tempMax: 30,
        humidityLevel: "Medium",
        family: "Lamiaceae",
        genus: "Ocimum",
        species: "O. basilicum",
        image: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400&h=300&fit=crop",
        description: "Hierba aromática muy utilizada en la cocina mediterránea e italiana.",
    }
];

export default function PlantCatalogPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("Todas las categorías");

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const mockFilters = [
        "Todas las categorías",
        "Hortalizas y leguminosas",
        "Plantas ornamentales",
        "Árboles frutales",
        "Hierbas aromáticas"
    ];

    const handleSearch = () => {
        console.log("Buscar:", searchTerm);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFilter(event.target.value);
        console.log("Filtro seleccionado:", event.target.value);
    };

    const handleAddPlant = () => {
        setModalOpen(true);
    };

    const handleViewDetail = (plant: Plant) => {
        setSelectedPlant(plant);
        setDetailModalOpen(true);
    };

    const handleEdit = (plant: Plant) => {
        setSelectedPlant(plant);
        setEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleCloseDetailModal = () => {
        setDetailModalOpen(false);
        setSelectedPlant(null);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedPlant(null);
    };

    return (
        <div className={`flex h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <Sidebar />
            <main className={`flex-1 flex flex-col ${isDark ? 'bg-gray-800' : 'bg-green-50'}`}>
                <div className="flex justify-center items-center py-8">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-900'}`}>
                        Catálogo de Plantas
                    </h1>
                </div>

                <div className="flex items-center gap-4 px-8 mb-6">
                    <div className="flex-1 max-w-lg relative">
                        <Input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="pr-10"
                        />
                        <button
                            onClick={handleSearch}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                                isDark
                                    ? 'text-gray-400 hover:text-gray-200'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            aria-label="Buscar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative">
                        <select
                            value={selectedFilter}
                            onChange={handleFilterChange}
                            className={`appearance-none h-9 px-3 py-1 pr-8 rounded-md border text-base shadow-xs transition-colors outline-none focus:ring-2 focus:ring-green-500 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-700'
                            }`}
                            style={{
                                backgroundColor: isDark ? 'rgb(55, 65, 81)' : 'white',
                                color: isDark ? 'white' : 'rgb(55, 65, 81)'
                            }}
                        >
                            {mockFilters.map((filter, index) => (
                                <option
                                    key={index}
                                    value={filter}
                                    style={{
                                        backgroundColor: isDark ? 'rgb(55, 65, 81)' : 'white',
                                        color: isDark ? 'white' : 'rgb(55, 65, 81)'
                                    }}
                                >
                                    {filter}
                                </option>
                            ))}
                        </select>
                        <div className={`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <Button
                        onClick={handleAddPlant}
                        variant="default"
                        className="font-semibold px-6 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Añadir planta
                    </Button>
                </div>

                <div className="px-8 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                        {mockPlants.map((plant) => (
                            <PlantCard
                                key={plant.id}
                                plant={plant}
                                onViewDetail={handleViewDetail}
                                onEdit={handleEdit}
                                isDark={isDark}
                            />
                        ))}
                    </div>
                </div>

                <PlantCatalogCreateModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    isDark={isDark}
                />

                <PlantDetailModal
                    plant={selectedPlant}
                    open={detailModalOpen}
                    onClose={handleCloseDetailModal}
                    isDark={isDark}
                />

                {editModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className={`max-w-md w-full rounded-lg p-6 ${
                            isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                        }`}>
                            <h3 className="text-lg font-semibold mb-4">Editar Planta</h3>
                            <p className="text-sm mb-6">Modal de edición - Por implementar con datos pre-cargados</p>
                            <div className="flex justify-end">
                                <Button onClick={handleCloseEditModal}>
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}