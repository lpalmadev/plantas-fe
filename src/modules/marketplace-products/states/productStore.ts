import { create } from 'zustand';
import { productService } from "../services/productService";
import type {
    ProductBasic,
    ProductDetail,
    ProductFilters,
    CreateProductDTO,
    UpdateProductDTO
} from "../lib/types";

interface ProductState {
    products: ProductBasic[];
    selectedProduct: ProductDetail | null;
    isLoading: boolean;
    isLoadingDetail: boolean;
    error: string | null;

    creating: boolean;
    updating: boolean;
    deleting: boolean;
    uploading: boolean;
    restoring: boolean;

    totalItems: number;
    totalPages: number;
    filters: ProductFilters;

    uploadedImageUrl: string | null;

    fetchProducts: (includeDeleted?: boolean) => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
    createProduct: (data: CreateProductDTO) => Promise<void>;
    updateProduct: (id: string, data: UpdateProductDTO) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    restoreProduct: (id: string) => Promise<void>;
    uploadImage: (file: File) => Promise<void>;
    setFilters: (filters: Partial<ProductFilters>) => void;
    resetUploadedImage: () => void;
}

const initialFilters: ProductFilters = {
    page: 1,
    search: '',
    category_id: undefined,
    includeDeleted: true
};

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    selectedProduct: null,
    isLoading: false,
    isLoadingDetail: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    uploading: false,
    restoring: false,
    totalItems: 0,
    totalPages: 0,
    filters: initialFilters,
    uploadedImageUrl: null,

    fetchProducts: async (includeDeleted = true) => {
        set({ isLoading: true, error: null });
        try {
            const filtersWithDeleted = { ...get().filters, includeDeleted };
            const response = await productService.getAllProducts(filtersWithDeleted);

            const productsWithDeletedFlag = response.data.map(product => ({
                ...product,
                is_deleted: product.is_deleted ?? false
            }));

            set({
                products: productsWithDeletedFlag,
                isLoading: false,
                totalItems: response.meta.totalItems,
                totalPages: response.meta.totalPages
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener productos"
            });
        }
    },

    fetchProductById: async (id: string) => {
        set({ isLoadingDetail: true, error: null });
        try {
            const product = await productService.getProductById(id);
            set({ selectedProduct: product, isLoadingDetail: false });
        } catch (error) {
            set({
                isLoadingDetail: false,
                error: error instanceof Error ? error.message : "Error al obtener detalle del producto"
            });
        }
    },

    createProduct: async (data: CreateProductDTO) => {
        set({ creating: true, error: null });
        try {
            await productService.createProduct(data);
            set({ creating: false, uploadedImageUrl: null });
            get().fetchProducts(true);
        } catch (error) {
            set({
                creating: false,
                error: error instanceof Error ? error.message : "Error al crear producto"
            });
            throw error;
        }
    },

    updateProduct: async (id: string, data: UpdateProductDTO) => {
        set({ updating: true, error: null });
        try {
            await productService.updateProduct(id, data);
            const updatedProduct = await productService.getProductById(id);
            set({
                updating: false,
                selectedProduct: updatedProduct,
                uploadedImageUrl: null
            });
            get().fetchProducts(true);
        } catch (error) {
            set({
                updating: false,
                error: error instanceof Error ? error.message : "Error al actualizar producto"
            });
            throw error;
        }
    },

    deleteProduct: async (id: string) => {
        set({ deleting: true, error: null });
        try {
            await productService.deleteProduct(id);
            set({ deleting: false, selectedProduct: null });
            get().fetchProducts(true);
        } catch (error) {
            set({
                deleting: false,
                error: error instanceof Error ? error.message : "Error al eliminar producto"
            });
            throw error;
        }
    },

    restoreProduct: async (id: string) => {
        set({ restoring: true, error: null });
        try {
            await productService.restoreProduct(id);
            set({ restoring: false, selectedProduct: null });
            get().fetchProducts(true);
        } catch (error) {
            set({
                restoring: false,
                error: error instanceof Error ? error.message : "Error al restaurar producto"
            });
            throw error;
        }
    },

    uploadImage: async (file: File) => {
        set({ uploading: true, error: null });
        try {
            const response = await productService.uploadImage(file);
            set({
                uploading: false,
                uploadedImageUrl: response.url
            });
        } catch (error) {
            set({
                uploading: false,
                error: error instanceof Error ? error.message : "Error al cargar imagen"
            });
            throw error;
        }
    },

    setFilters: (filters: Partial<ProductFilters>) => {
        set(state => ({
            filters: { ...state.filters, ...filters }
        }));
        get().fetchProducts(true);
    },

    resetUploadedImage: () => {
        set({ uploadedImageUrl: null });
    }
}));