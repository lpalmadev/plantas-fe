import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { useAuthStore } from "../../core/states/authStore";
import {
    Category,
    CategoriesResponse,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    UploadImageResponse
} from "../lib/types";

const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

const getFormDataHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        'Authorization': `Bearer ${token}`,
    };
};

async function handleResponseError(response: Response) {
    try {
        const errorData = await response.json();
        throw errorData;
    } catch (parseError) {
        if (parseError && typeof parseError === 'object' && 'message' in parseError) {
            throw parseError;
        }
        throw new Error(`Error ${response.status}`);
    }
}

export async function fetchCategories(parent_id?: string): Promise<Category[]> {
    let url = parent_id
        ? API_ENDPOINTS.MARKETPLACE_CATEGORIES_BY_PARENT(parent_id)
        : API_ENDPOINTS.MARKETPLACE_CATEGORIES;

    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        await handleResponseError(response);
    }

    const data: CategoriesResponse = await response.json();
    return data.data;
}

export async function createCategory(request: CreateCategoryRequest): Promise<{ id: string }> {
    let url = request.parent_id
        ? `${API_ENDPOINTS.MARKETPLACE_CATEGORIES}?parent_id=${request.parent_id}`
        : API_ENDPOINTS.MARKETPLACE_CATEGORIES;

    const body: any = { name: request.name };
    if (request.image_url) body.image_url = request.image_url;
    if (request.parent_id) body.parent_id = request.parent_id;

    const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        await handleResponseError(response);
    }

    return await response.json();
}

export async function updateCategory(id: string, request: UpdateCategoryRequest): Promise<{ id: string }> {
    const url = API_ENDPOINTS.MARKETPLACE_CATEGORY_BY_ID(id);

    const response = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        await handleResponseError(response);
    }

    return await response.json();
}

export async function uploadCategoryImage(file: File): Promise<string> {
    const url = API_ENDPOINTS.MARKETPLACE_CATEGORY_UPLOAD_IMAGE;
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(url, {
        method: "POST",
        headers: getFormDataHeaders(),
        body: formData,
    });

    if (!response.ok) {
        await handleResponseError(response);
    }

    const data: UploadImageResponse = await response.json();
    return data.url;
}

export async function updateCategoryImage(id: string, file: File): Promise<{ id: string, image_url?: string }> {
    const url = API_ENDPOINTS.MARKETPLACE_CATEGORY_IMAGE(id);
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(url, {
        method: "PUT",
        headers: getFormDataHeaders(),
        body: formData,
    });

    if (!response.ok) {
        await handleResponseError(response);
    }

    return await response.json();
}

export async function deleteCategoryImage(id: string, image_url: string): Promise<void> {
    const url = API_ENDPOINTS.MARKETPLACE_CATEGORY_IMAGE(id);

    const response = await fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ image_url }),
    });

    if (!response.ok) {
        await handleResponseError(response);
    }
}