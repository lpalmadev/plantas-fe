export interface Category {
    id: string;
    name: string;
    image_url: string | null;
    is_active: boolean;
    created_at: string;
    parent_id?: string;
}

export interface CategoriesResponse {
    data: Category[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface CreateCategoryRequest {
    name: string;
    parent_id?: string;
    image_url?: string;
}

export interface UpdateCategoryRequest {
    name: string;
    is_active: boolean;
    image_url?: string;
}

export interface UploadImageResponse {
    url: string;
}