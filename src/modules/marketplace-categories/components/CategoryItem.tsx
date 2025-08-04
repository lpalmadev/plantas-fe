import React, { useState } from "react";
import { useThemeStore } from "../../core/states/themeStore";
import { Category } from "../lib/types";
import { useCategoryChildren } from "../hooks/useCategories";
import { ConfirmModal } from "./ConfirmModal";

interface CategoryItemProps {
    category: Category;
    level?: number;
    onEdit: (category: Category) => void;
    onDeactivate: (category: Category) => void;
    onAddChild: (parent: Category) => void;
    isDeactivating?: boolean;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
                                                              category,
                                                              level = 0,
                                                              onEdit,
                                                              onDeactivate,
                                                              onAddChild,
                                                              isDeactivating = false,
                                                          }) => {
    const { mode } = useThemeStore();
    const [expanded, setExpanded] = useState(false);
    const {
        children,
        loading: loadingChildren,
        loadChildren,
    } = useCategoryChildren(category.id);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);

    const handleToggle = async () => {
        setExpanded(!expanded);
        if (!expanded && children.length === 0) {
            try {
                await loadChildren();
            } catch (error) {
            }
        }
    };

    const handleDeactivateClick = () => {
        setShowDeactivateModal(true);
    };

    const handleConfirmDeactivate = () => {
        setShowDeactivateModal(false);
        onDeactivate(category);
    };

    const handleCancelDeactivate = () => {
        setShowDeactivateModal(false);
    };

    const marginLeft = level * 20;
    const isDark = mode === "dark";
    const getBackgroundColor = () => {
        if (level === 0) return isDark ? "bg-gray-800" : "bg-green-50";
        if (level === 1) return isDark ? "bg-gray-700" : "bg-green-25";
        return isDark ? "bg-gray-600" : "bg-green-10";
    };

    const getBorderColor = () => {
        if (level === 0) return "border-green-500";
        if (level === 1) return "border-green-400";
        return "border-green-300";
    };

    return (
        <>
            <div className="mb-2" style={{ marginLeft }}>
                <div className={`border-l-4 ${getBorderColor()} rounded p-3 ${getBackgroundColor()} ${isDeactivating ? "opacity-50" : ""}`}>
                    <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0 mt-1">
                            {category.is_active ? "🟢" : "⚪"}
                        </span>
                        <div className="flex-1 min-w-0">
                            <div
                                className={`text-sm font-medium cursor-pointer hover:opacity-80 ${isDark ? "text-white" : "text-gray-800"}`}
                                onClick={handleToggle}
                            >
                                {category.name}
                            </div>
                            <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                {new Date(category.created_at).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                            {category.image_url && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <img
                                        src={category.image_url}
                                        alt={`Imagen categoría`}
                                        className="w-12 h-12 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => window.open(category.image_url, "_blank")}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                            <button
                                onClick={() => onEdit(category)}
                                disabled={isDeactivating}
                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Editar"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => onAddChild(category)}
                                disabled={isDeactivating}
                                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Añadir categoría hija"
                            >
                                ➕
                            </button>
                            <button
                                onClick={handleToggle}
                                disabled={isDeactivating}
                                className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title={expanded ? "Contraer" : "Expandir"}
                            >
                                {expanded ? "▼" : "▶"}
                            </button>
                        </div>
                    </div>
                </div>
                {expanded && (
                    <div className="mt-2">
                        {loadingChildren ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                                    Cargando hijas...
                                </span>
                            </div>
                        ) : children.length > 0 ? (
                            <div className="space-y-1">
                                {children.map((child) => (
                                    <CategoryItem
                                        key={child.id}
                                        category={child}
                                        level={level + 1}
                                        onEdit={onEdit}
                                        onDeactivate={onDeactivate}
                                        onAddChild={onAddChild}
                                        isDeactivating={isDeactivating}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                    No hay categorías hijas aún
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <ConfirmModal
                isOpen={showDeactivateModal}
                title="¿Desactivar categoría?"
                message="La categoría se desactivará, pero no se eliminará. ¿Deseas continuar?"
                confirmText="Desactivar"
                cancelText="Cancelar"
                type="danger"
                onConfirm={handleConfirmDeactivate}
                onCancel={handleCancelDeactivate}
            />
        </>
    );
};