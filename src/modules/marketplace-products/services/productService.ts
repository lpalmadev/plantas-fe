import {
    ProductBasic,
    ProductDetail,
    ProductResponse,
    ProductFilters,
    CreateProductDTO,
    UpdateProductDTO,
    ImageUploadResponse,
    ProductImage
} from "../lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { getHeaders, getheadersima } from "../../core/utils/UtilsFuntions";

export const productService = {
    getAllProducts: async (filters: ProductFilters): Promise<ProductResponse> => {
        const { page, search, category_id, sortBy, sortOrder, includeDeleted } = filters;
        const searchParam = search ? `&search=${search}` : '';
        const categoryParam = category_id ? `&category_id=${category_id}` : '';
        const sortByParam = sortBy ? `&sortBy=${sortBy}` : '';
        const sortOrderParam = sortOrder ? `&sortOrder=${sortOrder}` : '';
        const includeDeletedParam = includeDeleted ? `&includeDeleted=true` : '';

        const url = `${API_ENDPOINTS.MARKETPLACE_PRODUCTS}?page=${page}${searchParam}${categoryParam}${sortByParam}${sortOrderParam}${includeDeletedParam}`;

        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error("Error al obtener los productos");
        return await response.json();
    },

    getProductById: async (id: string): Promise<ProductDetail> => {
        const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCT_BY_ID(id), {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener el producto");
        return await response.json();
    },

    createProduct: async (productData: CreateProductDTO): Promise<{ id: string }> => {
        const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCTS, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al crear el producto");
        }
        return await response.json();
    },

    updateProduct: async (id: string, productData: UpdateProductDTO): Promise<{ id: string }> => {
        const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCT_BY_ID(id), {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al actualizar el producto");
        }
        return await response.json();
    },

    deleteProduct: async (id: string): Promise<void> => {
        const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCT_BY_ID(id), {
            method: "DELETE",
            headers: getHeaders()
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al eliminar el producto");
        }
    },

    restoreProduct: async (id: string): Promise<{ id: string }> => {
        const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCT_BY_ID(id), {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ is_deleted: false }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al restaurar el producto");
        }
        return await response.json();
    },

    uploadImage: async (file: File): Promise<ImageUploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCT_UPLOAD_IMAGE, {
            method: "POST",
            headers: getheadersima(),
            body: formData
        });

        if (!response.ok) {
            const responseText = await response.text();
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || errorMessage;
            } catch {}
            throw new Error(errorMessage);
        }

        return await response.json();
    },

    updateMainImage: async (productId: string, file: File): Promise<ImageUploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCT_MAIN_IMAGE(productId), {
            method: "PUT",
            headers: getheadersima(),
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch {}
            throw new Error(errorMessage);
        }

        return await response.json();
    },

    deleteMainImage: async (productId: string): Promise<void> => {
        const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCT_MAIN_IMAGE(productId), {
            method: "DELETE",
            headers: getHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch {}
            throw new Error(errorMessage);
        }
    },

    addSecondaryImage: async (productId: string, file: File): Promise<ProductImage> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCT_IMAGES(productId), {
                method: "POST",
                headers: getheadersima(),
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error response:", errorText);
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error("Error parsing error response:", e);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("❌ Error en addSecondaryImage:", error);
            throw error;
        }
    },

    updateSecondaryImage: async (productId: string, imageId: string, file: File): Promise<ProductImage> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCT_IMAGE_BY_ID(productId, imageId), {
                method: "PUT",
                headers: getheadersima(),
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error response:", errorText);
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error("Error parsing error response:", e);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("❌ Error en updateSecondaryImage:", error);
            throw error;
        }
    },

    deleteSecondaryImage: async (productId: string, imageId: string): Promise<void> => {
        try {
            const response = await fetch(API_ENDPOINTS.MARKETPLACE_PRODUCT_IMAGE_BY_ID(productId, imageId), {
                method: "DELETE",
                headers: getHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Error response:", errorText);
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error("Error parsing error response:", e);
                }
                throw new Error(errorMessage);
            }

        } catch (error) {
            console.error("❌ Error en deleteSecondaryImage:", error);
            throw error;
        }
    }
};