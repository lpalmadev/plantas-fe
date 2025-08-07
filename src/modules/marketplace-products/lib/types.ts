export interface ProductImage {
    id: string;
    image_url: string;
}

export interface ProductCategory {
    id: string;
    name: string;
}

export interface ProductUser {
    id: string;
    name: string;
    email: string;
}

export interface ProductBasic {
    id: string;
    name: string;
    main_image: string | null;
    is_active: boolean;
    is_deleted: boolean;
    price: number;
    offer_price?: number | null;
    has_offer?: boolean;
}

export interface ProductDetail {
    id: string;
    name: string;
    description: string;
    price: number;
    offer_price: number | null;
    stock_available: number;
    stock_sold: number;
    shipping_price: number;
    is_active: boolean;
    is_deleted: boolean;
    has_offer: boolean;
    isCompany: boolean;
    main_image: string | null;
    created_at: string;
    deleted_at?: string;
    category: ProductCategory;
    images: ProductImage[];
    user: ProductUser;
}

export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    stock_available: number;
    shipping_price: number;
    main_image?: string;
    category_id: string;
}

export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    stock_available?: number;
    shipping_price?: number;
    is_active?: boolean;
    is_deleted?: boolean;
    has_offer?: boolean;
    offer_price?: number | null;
    category_id?: string;
}

export interface ProductResponse {
    data: ProductBasic[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface ProductFilters {
    page: number;
    search: string;
    category_id?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    includeDeleted?: boolean;
}

export interface ImageUploadResponse {
    url: string;
}