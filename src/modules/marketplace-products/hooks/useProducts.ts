import { useEffect } from "react";
import { useProductStore } from "../states/productStore";

export function useProducts() {
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
        setFilters,
        resetUploadedImage,
    } = useProductStore();

    useEffect(() => {
        fetchProducts(true);
    }, []);

    const handleSearch = (search: string) => setFilters({ search, page: 1 });
    const handlePageChange = (page: number) => setFilters({ page });
    const handleCategoryChange = (category_id: string) => setFilters({ category_id, page: 1 });

    const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
        setFilters({ sortBy, sortOrder, page: 1 });
    };

    return {
        products,
        selectedProduct,
        isLoading,
        isLoadingDetail,
        error,
        totalItems,
        totalPages,
        filters,
        creating,
        updating,
        deleting,
        uploading,
        restoring,
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
        handleCategoryChange,
        handleSortChange,
        resetUploadedImage,
    };
}