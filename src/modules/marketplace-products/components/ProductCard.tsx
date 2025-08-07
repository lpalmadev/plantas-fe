"use client";

import { Button } from "../../core/components/ui/button";
import { ProductBasic } from "../lib/types";

interface ProductCardProps {
    product: ProductBasic;
    onViewDetail: (productId: string) => void;
    onEdit: (productId: string) => void;
    onDelete: (productId: string) => void;
    onRestore?: (productId: string) => void;
    isDark?: boolean;
}

export function ProductCard({
                                product,
                                onViewDetail,
                                onEdit,
                                onDelete,
                                onRestore,
                                isDark = false
                            }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    const isDeleted = product.is_deleted || false;

    return (
        <div className={`rounded-lg border shadow-md overflow-hidden transition-transform hover:scale-105 ${
            isDeleted
                ? isDark
                    ? 'bg-red-900/20 border-red-600 opacity-75'
                    : 'bg-red-50 border-red-300 opacity-80'
                : isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
        }`}>
            <div className="relative h-48 w-full overflow-hidden">
                {product.main_image ? (
                    <img
                        src={`${product.main_image}?t=${Date.now()}`}
                        alt={product.name}
                        className={`w-full h-full object-cover ${isDeleted ? 'grayscale' : ''}`}
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                        isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                        <div className="text-center">
                            <span className="text-4xl mb-2 block">📦</span>
                            <span className="text-sm">Sin imagen</span>
                        </div>
                    </div>
                )}

                {isDeleted && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                        🗑️ Eliminado
                    </div>
                )}

                {!isDeleted && !product.is_active && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                        Inactivo
                    </div>
                )}

                {!isDeleted && product.has_offer && product.offer_price && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                        ¡Oferta!
                    </div>
                )}
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${
                        isDeleted
                            ? 'line-through text-red-600'
                            : isDark ? 'text-blue-400' : 'text-blue-900'
                    }`}>
                        🛍️ {product.name}
                    </h3>
                    {isDeleted && (
                        <p className="text-xs text-red-600 mt-1">
                            Este producto ha sido eliminado
                        </p>
                    )}
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Precio:
                        </span>
                        <div className="text-right">
                            {!isDeleted && product.has_offer && product.offer_price ? (
                                <>
                                    <span className="line-through text-gray-500 text-xs">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="text-green-600 font-bold ml-2">
                                        {formatPrice(product.offer_price)}
                                    </span>
                                </>
                            ) : (
                                <span className={`font-bold ${
                                    isDeleted
                                        ? 'text-gray-500'
                                        : isDark ? 'text-green-400' : 'text-green-600'
                                }`}>
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                            isDeleted
                                ? 'bg-red-600'
                                : product.is_active ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {isDeleted
                                ? 'Eliminado'
                                : product.is_active ? 'Activo' : 'Inactivo'
                            }
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    {isDeleted ? (
                        <>
                            <Button
                                onClick={() => onViewDetail(product.id)}
                                variant="outline"
                                size="sm"
                                className="flex-1 flex items-center gap-2"
                            >
                                <span>👁️</span>
                                Ver detalle
                            </Button>
                            {onRestore && (
                                <Button
                                    onClick={() => onRestore(product.id)}
                                    variant="default"
                                    size="sm"
                                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                >
                                    <span>🔄</span>
                                    Restaurar
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={() => onViewDetail(product.id)}
                                variant="outline"
                                size="sm"
                                className="flex-1 flex items-center gap-2"
                            >
                                <span>👁️</span>
                                Ver detalle
                            </Button>
                            <Button
                                onClick={() => onEdit(product.id)}
                                variant="default"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <span>✏️</span>
                            </Button>
                            <Button
                                onClick={() => onDelete(product.id)}
                                variant="destructive"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <span>🗑️</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}