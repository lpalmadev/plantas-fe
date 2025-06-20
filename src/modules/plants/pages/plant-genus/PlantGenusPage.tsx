import React from "react";
import Sidebar from "../../../core/components/layout/sidebar/pages/Sidebar.tsx";
import { useThemeStore } from "../../../core/states/themeStore";

const PlantGenusPage = () => {
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className={`flex-1 flex items-center justify-center transition-colors duration-300 ${
                isDark ? 'bg-gray-900' : 'bg-green-50'
            }`}>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-green-400' : 'text-green-900'
                }`}>
                    Género de Plantas
                </h1>
            </main>
        </div>
    );
};

export default PlantGenusPage;