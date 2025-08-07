"use client";

import { useState } from "react";
import { Input } from "../../core/components/ui/input";

interface ProductFiltersProps {
    onSearch: (search: string) => void;
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
    isDark?: boolean;
}

export function ProductFilters({
                                   onSearch,
                                   onSortChange,
                                   isDark = false
                               }: ProductFiltersProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const sortOptions = [
        { label: "Nombre (A-Z)", value: "name-asc", sortBy: "name", sortOrder: "asc" as const },
        { label: "Nombre (Z-A)", value: "name-desc", sortBy: "name", sortOrder: "desc" as const },
        { label: "Precio: Menor a mayor", value: "price-asc", sortBy: "price", sortOrder: "asc" as const },
        { label: "Precio: Mayor a menor", value: "price-desc", sortBy: "price", sortOrder: "desc" as const },
        { label: "Más reciente", value: "created_at-desc", sortBy: "created_at", sortOrder: "desc" as const },
        { label: "Más antiguo", value: "created_at-asc", sortBy: "created_at", sortOrder: "asc" as const },
        { label: "Estado: Activos primero", value: "is_active-desc", sortBy: "is_active", sortOrder: "desc" as const },
        { label: "Estado: Inactivos primero", value: "is_active-asc", sortBy: "is_active", sortOrder: "asc" as const },
        { label: "Stock: Mayor a menor", value: "stock_available-desc", sortBy: "stock_available", sortOrder: "desc" as const },
        { label: "Stock: Menor a mayor", value: "stock_available-asc", sortBy: "stock_available", sortOrder: "asc" as const }
    ];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = sortOptions.find(option => option.value === e.target.value);
        if (selectedOption) {
            onSortChange(selectedOption.sortBy, selectedOption.sortOrder);
        }
    };

    return (
        <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 max-w-lg relative">
                <form onSubmit={handleSearchSubmit} className="flex">
                    <Input
                        type="text"
                        placeholder="Buscar productos por nombre..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pr-10"
                    />
                    <button
                        type="submit"
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
                </form>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Ordenar por:</label>
                <select
                    onChange={handleSortChange}
                    defaultValue="name-asc"
                    className={`h-9 px-3 rounded-md border text-sm transition-colors outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px] ${
                        isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-700'
                    }`}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}