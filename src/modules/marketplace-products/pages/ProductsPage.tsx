"use client";

import { useState } from "react";
import Sidebar from "../../core/components/layout/sidebar/pages/Sidebar";
import { Button } from "../../core/components/ui/button";
import { ProductFilters } from "../components/ProductFilters";
import { ProductFormModal } from "../components/ProductFormModal";
import { ProductCard } from "../components/ProductCard";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { Pagination } from "../components/Pagination";
import { useProducts } from "../hooks/useProducts";
import { useThemeStore } from "../../core/states/themeStore";

export default function ProductsPage() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [restoreModalOpen, setRestoreModalOpen] = useState(false);

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const {
        products,
        selectedProduct,
        isLoading,
        isLoadingDetail,
        error,
        creating,
        updating,
        deleting,
        uploading,
        restoring,
        totalItems,
        totalPages,
        filters,
        uploadedImageUrl,
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        uploadImage,
        handleSearch,
        handlePageChange,
        handleSortChange,
        resetUploadedImage
    } = useProducts();

    const handleAddProduct = () => {
        resetUploadedImage();
        setCreateModalOpen(true);
    };

    const handleViewDetail = (productId: string) => {
        fetchProductById(productId);
        setDetailModalOpen(true);
    };

    const handleEdit = (productId: string) => {
        fetchProductById(productId);
        setEditModalOpen(true);
    };

    const handleDelete = (productId: string) => {
        fetchProductById(productId);
        setDeleteModalOpen(true);
    };

    const handleRestore = (productId: string) => {
        fetchProductById(productId);
        setRestoreModalOpen(true);
    };

    const handleCreateSubmit = async (data: any) => {
        await createProduct(data);
        setCreateModalOpen(false);
    };

    const handleUpdateSubmit = async (data: any) => {
        if (selectedProduct) {
            await updateProduct(selectedProduct.id, data);
            setEditModalOpen(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedProduct) {
            await deleteProduct(selectedProduct.id);
            setDeleteModalOpen(false);
        }
    };

    const handleConfirmRestore = async () => {
        if (selectedProduct) {
            await restoreProduct(selectedProduct.id);
            setRestoreModalOpen(false);
        }
    };

    const deletedCount = products.filter(p => p.is_deleted).length;

    return (
        <div className={`flex h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <Sidebar />
            <main className={`flex-1 flex flex-col ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                <div className="flex justify-center items-center py-8">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>
                        Gestión de Productos del Marketplace
                    </h1>
                </div>

                <div className="flex items-center justify-between gap-4 px-8 mb-6">
                    <ProductFilters
                        onSearch={handleSearch}
                        onSortChange={handleSortChange}
                        isDark={isDark}
                    />

                    <Button
                        onClick={handleAddProduct}
                        variant="default"
                        className="font-semibold px-6 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Añadir producto
                    </Button>
                </div>

                <div className="px-8 flex-1 overflow-y-auto scrollbar-none">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Cargando productos...
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <span className="text-4xl mb-4 block">⚠️</span>
                                <p className="text-red-500 text-lg mb-4">{error}</p>
                                <Button onClick={() => fetchProducts(true)} variant="outline">
                                    Reintentar
                                </Button>
                            </div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <span className="text-6xl mb-4 block">📦</span>
                                <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    No se encontraron productos
                                </p>
                                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Comienza añadiendo tu primer producto al marketplace
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={`mb-4 p-3 rounded-md ${
                                isDark ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                            }`}>
                                <div className="flex items-center gap-2">
                                    <span>📊</span>
                                    <span className="text-sm">
                                        Mostrando {products.length} de {totalItems} productos
                                        {deletedCount > 0 && ` (incluyendo ${deletedCount} eliminados)`}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onViewDetail={handleViewDetail}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onRestore={handleRestore}
                                        isDark={isDark}
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={filters.page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                isDark={isDark}
                            />
                        </>
                    )}
                </div>

                <style jsx>{`
                    .scrollbar-none::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-none {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>

                <ProductFormModal
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={handleCreateSubmit}
                    isSubmitting={creating}
                    isLoadingDetail={isLoadingDetail}
                    uploadImage={uploadImage}
                    isUploading={uploading}
                    uploadedImageUrl={uploadedImageUrl}
                    resetUploadedImage={resetUploadedImage}
                    isDark={isDark}
                />

                <ProductFormModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSubmit={handleUpdateSubmit}
                    isSubmitting={updating}
                    isLoadingDetail={isLoadingDetail}
                    uploadImage={uploadImage}
                    isUploading={uploading}
                    uploadedImageUrl={uploadedImageUrl}
                    resetUploadedImage={resetUploadedImage}
                    product={selectedProduct}
                    isEdit={true}
                    isDark={isDark}
                />

                <ProductDetailModal
                    product={selectedProduct}
                    open={detailModalOpen}
                    onClose={() => setDetailModalOpen(false)}
                    isDark={isDark}
                />

                <DeleteConfirmationModal
                    open={deleteModalOpen}
                    title="🗑️ Eliminar Producto"
                    message={`¿Estás seguro de que deseas eliminar el producto "${selectedProduct?.name}"? Esta acción marcará el producto como eliminado pero podrás restaurarlo después.`}
                    onCancel={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    isDeleting={deleting}
                    isDark={isDark}
                />

                <DeleteConfirmationModal
                    open={restoreModalOpen}
                    title="🔄 Restaurar Producto"
                    message={`¿Estás seguro de que deseas restaurar el producto "${selectedProduct?.name}"? El producto volverá a estar disponible en el marketplace.`}
                    onCancel={() => setRestoreModalOpen(false)}
                    onConfirm={handleConfirmRestore}
                    isDeleting={restoring}
                    confirmText="✅ Sí, Restaurar"
                    cancelText="❌ Cancelar"
                    isDark={isDark}
                />
            </main>
        </div>
    );
}