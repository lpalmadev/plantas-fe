import { useState, useCallback } from "react";
import { useCategoryStore } from "../states/categoryStore";
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "../lib/types";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    uploadCategoryImage,
    updateCategoryImage,
    deleteCategoryImage
} from "../services/categoryService";

export function useCategories() {
    const { categories, loading, error, loadCategories } = useCategoryStore();
    const refetch = useCallback(() => {
        loadCategories();
    }, [loadCategories]);
    return { categories, loading, error, refetch, loadCategories };
}

export function useCategoryOperations() {
    const { loadCategories } = useCategoryStore();
    const [saving, setSaving] = useState(false);
    const [deactivating, setDeactivating] = useState<string | null>(null);

    const createCategoryItem = useCallback(async (request: CreateCategoryRequest) => {
        setSaving(true);
        try {
            await createCategory(request);
            await loadCategories();
        } catch (error) {
            throw error;
        } finally {
            setSaving(false);
        }
    }, [loadCategories]);

    const updateCategoryItem = useCallback(async (id: string, request: UpdateCategoryRequest) => {
        setSaving(true);
        try {
            await updateCategory(id, request);
            await loadCategories();
        } catch (error) {
            throw error;
        } finally {
            setSaving(false);
        }
    }, [loadCategories]);

    const deactivateCategoryItem = useCallback(async (id: string, name: string) => {
        setDeactivating(id);
        try {
            await updateCategory(id, { name, is_active: false });
            await loadCategories();
        } catch (error) {
            throw error;
        } finally {
            setDeactivating(null);
        }
    }, [loadCategories]);

    return {
        createCategoryItem,
        updateCategoryItem,
        deactivateCategoryItem,
        saving,
        deactivating,
    };
}

export function useCategoryChildren(parent_id?: string) {
    const [children, setChildren] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadChildren = useCallback(async () => {
        if (!parent_id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCategories(parent_id);
            setChildren(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [parent_id]);

    return { children, loading, error, loadChildren, setChildren };
}

export function useCategoryImages() {
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    const uploadImage = useCallback(async (file: File): Promise<string> => {
        setUploading(true);
        try {
            return await uploadCategoryImage(file);
        } catch (error) {
            throw error;
        } finally {
            setUploading(false);
        }
    }, []);

    const updateImageOnServer = useCallback(async (id: string, file: File) => {
        return await updateCategoryImage(id, file);
    }, []);

    const deleteImageFromServer = useCallback(async (id: string, image_url: string): Promise<void> => {
        setDeleting(image_url);
        try {
            await deleteCategoryImage(id, image_url);
        } catch (error) {
            throw error;
        } finally {
            setDeleting(null);
        }
    }, []);

    return {
        uploadImage,
        updateImageOnServer,
        deleteImageFromServer,
        uploading,
        deleting
    };
}