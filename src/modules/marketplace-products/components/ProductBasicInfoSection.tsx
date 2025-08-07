"use client";

import { Input } from "../../core/components/ui/input";
import { useCategoriesWithHierarchy } from "../../marketplace-categories/hooks/useCategories";
import { useEffect } from "react";

interface ProductBasicInfoSectionProps {
    formData: {
        name: string;
        description: string;
        price: number;
        stock_available: number;
        shipping_price: number;
        is_active: boolean;
        has_offer: boolean;
        offer_price: number | null;
        category_id: string;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onOfferChange: (has_offer: boolean) => void;
    isDark?: boolean;
}

export function ProductBasicInfoSection({
                                            formData,
                                            onInputChange,
                                            onOfferChange,
                                            isDark = false
                                        }: ProductBasicInfoSectionProps) {
    const { flatCategories, loading, error, loadAllCategoriesWithHierarchy } = useCategoriesWithHierarchy();

    useEffect(() => {
        loadAllCategoriesWithHierarchy();
    }, [loadAllCategoriesWithHierarchy]);

    const activeCategories = flatCategories.filter(cat => cat.is_active);

    return (
        <>
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    🛍️ Nombre del producto
                </h3>
                <Input
                    name="name"
                    placeholder="Ejemplo: Maceta de cerámica"
                    value={formData.name}
                    onChange={onInputChange}
                    required
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    💰 Datos comerciales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Precio</label>
                        <div className="flex">
                            <Input
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="rounded-r-none"
                                value={formData.price}
                                onChange={onInputChange}
                                required
                            />
                            <div className={`flex items-center px-3 border-l-0 border rounded-r-md ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'
                            }`}>
                                $
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock disponible</label>
                        <Input
                            name="stock_available"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.stock_available}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Precio de envío</label>
                        <div className="flex">
                            <Input
                                name="shipping_price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="rounded-r-none"
                                value={formData.shipping_price}
                                onChange={onInputChange}
                                required
                            />
                            <div className={`flex items-center px-3 border-l-0 border rounded-r-md ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'
                            }`}>
                                $
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => onInputChange({
                                target: { name: 'is_active', type: 'checkbox', checked: e.target.checked }
                            } as any)}
                            className="rounded"
                        />
                        <span>Producto activo</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.has_offer}
                            onChange={(e) => onOfferChange(e.target.checked)}
                            className="rounded"
                        />
                        <span>Tiene oferta</span>
                    </label>
                </div>

                {formData.has_offer && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Precio de oferta</label>
                        <div className="flex max-w-xs">
                            <Input
                                name="offer_price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="rounded-r-none"
                                value={formData.offer_price || ''}
                                onChange={onInputChange}
                            />
                            <div className={`flex items-center px-3 border-l-0 border rounded-r-md ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'
                            }`}>
                                $
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Categoría</label>
                    {loading ? (
                        <div className={`w-full px-3 py-2 border rounded-md flex items-center gap-2 ${
                            isDark ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}>
                            <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                            Cargando categorías...
                        </div>
                    ) : error ? (
                        <div className={`w-full px-3 py-2 border rounded-md ${
                            isDark ? 'bg-red-900 border-red-600 text-red-300' : 'bg-red-50 border-red-300 text-red-700'
                        }`}>
                            ⚠️ {error}
                        </div>
                    ) : (
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={onInputChange}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="">Selecciona una categoría</option>
                            {activeCategories.map((category) => {
                                const getIndentation = (level: number) => {
                                    if (level === 0) return '';

                                    const spaces = '\u00A0\u00A0'.repeat(level * 2);
                                    return spaces + '└─ ';
                                };

                                return (
                                    <option key={category.id} value={category.id}>
                                        {getIndentation(category.level)}{category.name}
                                    </option>
                                );
                            })}
                        </select>
                    )}

                    {!loading && !error && activeCategories.length === 0 && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                            No hay categorías activas disponibles. Cree una categoría primero.
                        </p>
                    )}

                    {!loading && !error && activeCategories.length > 0 && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Seleccione la categoría más específica que describa su producto
                        </p>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    📝 Descripción
                </h3>
                <textarea
                    name="description"
                    placeholder="Ejemplo: Maceta de cerámica perfecta para plantas de interior..."
                    rows={4}
                    value={formData.description}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-md resize-none ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                    }`}
                    required
                />
            </div>
        </>
    );
}