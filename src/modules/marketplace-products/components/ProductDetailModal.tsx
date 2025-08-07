"use client";

import { useState } from "react";
import { Button } from "../../core/components/ui/button";
import { ProductDetail } from "../lib/types";

interface ProductDetailModalProps {
    product: ProductDetail | null;
    open: boolean;
    onClose: () => void;
    isDark?: boolean;
}

export function ProductDetailModal({
                                       product,
                                       open,
                                       onClose,
                                       isDark = false
                                   }: ProductDetailModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!open || !product) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
    };

    const allImages = [
        ...(product.main_image ? [{ id: 'main', image_url: product.main_image }] : []),
        ...product.images
    ];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}>
                <div className="border-b p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Detalle del Producto</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {product.is_deleted && (
                        <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-900/20">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🗑️</span>
                                <div>
                                    <p className="font-semibold text-red-400 text-lg">Producto Eliminado</p>
                                    <p className="text-red-300 text-sm">
                                        Este producto ha sido eliminado y no está visible para los usuarios.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                            {allImages && allImages.length > 0 ? (
                                <div className="relative">
                                    <img
                                        src={`${allImages[currentImageIndex].image_url}?t=${Date.now()}`}
                                        alt={product.name}
                                        className={`w-full h-64 object-cover rounded-lg ${
                                            product.is_deleted ? 'grayscale' : ''
                                        }`}
                                    />

                                    {allImages.length > 1 && (
                                        <div className="absolute inset-0 flex items-center justify-between px-2">
                                            <button
                                                onClick={prevImage}
                                                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                            >
                                                ◀
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                            >
                                                ▶
                                            </button>
                                        </div>
                                    )}

                                    {allImages.length > 1 && (
                                        <div className="flex justify-center mt-2 gap-1">
                                            {allImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-2 h-2 rounded-full ${
                                                        currentImageIndex === index
                                                            ? (isDark ? 'bg-blue-400' : 'bg-blue-600')
                                                            : (isDark ? 'bg-gray-600' : 'bg-gray-300')
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={`w-full h-64 flex items-center justify-center rounded-lg ${
                                    isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    <div className="text-center">
                                        <span className="text-4xl mb-2 block">📦</span>
                                        <span className="text-sm">Sin imagen</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:w-2/3 space-y-4">
                            <div>
                                <h3 className={`text-2xl font-bold flex items-center gap-2 ${
                                    product.is_deleted
                                        ? 'text-red-400'
                                        : isDark ? 'text-blue-400' : 'text-blue-900'
                                }`}>
                                    🛍️ {product.name}
                                    {product.is_deleted && (
                                        <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                                            ELIMINADO
                                        </span>
                                    )}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`w-2 h-2 rounded-full ${
                                        product.is_deleted
                                            ? 'bg-red-600'
                                            : product.is_active ? 'bg-green-500' : 'bg-red-500'
                                    }`}></span>
                                    <span className={`text-sm font-medium ${
                                        product.is_deleted
                                            ? 'text-red-400'
                                            : product.is_active ? 'text-green-400' : 'text-yellow-400'
                                    }`}>
                                        {product.is_deleted
                                            ? '🗑️ Eliminado'
                                            : product.is_active ? '✅ Activo' : '⏸️ Inactivo'
                                        }
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    💰 Información comercial
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span><strong>Precio:</strong></span>
                                        <div className="text-right">
                                            {!product.is_deleted && product.has_offer && product.offer_price ? (
                                                <>
                                                    <span className="line-through text-gray-500 text-sm">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    <span className="text-green-600 font-bold ml-2">
                                                        {formatPrice(product.offer_price)}
                                                    </span>
                                                    <div className="text-xs text-green-600">¡En oferta!</div>
                                                </>
                                            ) : (
                                                <span className={`font-bold ${
                                                    product.is_deleted
                                                        ? 'text-gray-500'
                                                        : isDark ? 'text-blue-400' : 'text-blue-600'
                                                }`}>
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-500">📦</span>
                                        <span><strong>Stock disponible:</strong> {product.stock_available} unidades</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500">📈</span>
                                        <span><strong>Stock vendido:</strong> {product.stock_sold} unidades</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-500">🚚</span>
                                        <span><strong>Precio de envío:</strong> {formatPrice(product.shipping_price)}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    🏷️ Categoría
                                </h4>
                                <div className={`p-3 rounded-md ${
                                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                    <span className="font-medium">{product.category.name}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    👤 Vendedor
                                </h4>
                                <div className={`p-3 rounded-md ${
                                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                    <div className="font-medium">{product.user.name}</div>
                                    <div className="text-sm opacity-70">{product.user.email}</div>
                                    <div className="text-xs mt-1">
                                        {product.isCompany ? '🏢 Empresa' : '👤 Usuario individual'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            📝 Descripción
                        </h4>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {product.description}
                        </p>
                    </div>

                    <div className={`p-3 rounded-md text-sm ${
                        isDark ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                    }`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span>📅</span>
                            <strong>Fecha de creación</strong>
                        </div>
                        <div>{formatDate(product.created_at)}</div>
                    </div>

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