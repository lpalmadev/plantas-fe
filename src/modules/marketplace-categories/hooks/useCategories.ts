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
import { mapErrorMessage } from "../utils/errorMapper";

export function useCategories() {
    const { categories, loading, error, loadCategories, clearError } = useCategoryStore();
    const refetch = useCallback(() => {
        loadCategories();
    }, [loadCategories]);
    return { categories, loading, error, refetch, loadCategories, clearError };
}

export function useCategoriesWithHierarchy() {
    const {
        categoriesHierarchy,
        flatCategories,
        loading,
        error,
        loadAllCategoriesWithHierarchy,
        clearError
    } = useCategoryStore();

    const refetch = useCallback(() => {
        loadAllCategoriesWithHierarchy();
    }, [loadAllCategoriesWithHierarchy]);

    return {
        categoriesHierarchy,
        flatCategories,
        loading,
        error,
        refetch,
        loadAllCategoriesWithHierarchy,
        clearError
    };
}

export function useCategoryOperations() {
    const { loadCategories } = useCategoryStore();
    const [saving, setSaving] = useState(false);
    const [deactivating, setDeactivating] = useState<string | null>(null);
    const [createError, setCreateError] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [deactivateError, setDeactivateError] = useState<string | null>(null);

    const createCategoryItem = useCallback(async (request: CreateCategoryRequest) => {
        setSaving(true);
        setCreateError(null);
        try {
            await createCategory(request);
            await loadCategories();
        } catch (error: any) {
            setCreateError(mapErrorMessage(error));
            throw error;
        } finally {
            setSaving(false);
        }
    }, [loadCategories]);

    const updateCategoryItem = useCallback(async (id: string, request: UpdateCategoryRequest) => {
        setSaving(true);
        setUpdateError(null);
        try {
            await updateCategory(id, request);
            await loadCategories();
        } catch (error: any) {
            setUpdateError(mapErrorMessage(error));
            throw error;
        } finally {
            setSaving(false);
        }
    }, [loadCategories]);

    const deactivateCategoryItem = useCallback(async (id: string, name: string) => {
        setDeactivating(id);
        setDeactivateError(null);
        try {
            await updateCategory(id, { name, is_active: false });
            await loadCategories();
        } catch (error: any) {
            setDeactivateError(mapErrorMessage(error));
            throw error;
        } finally {
            setDeactivating(null);
        }
    }, [loadCategories]);

    const clearCreateError = () => setCreateError(null);
    const clearUpdateError = () => setUpdateError(null);
    const clearDeactivateError = () => setDeactivateError(null);

    return {
        createCategoryItem,
        updateCategoryItem,
        deactivateCategoryItem,
        saving,
        deactivating,
        createError,
        updateError,
        deactivateError,
        clearCreateError,
        clearUpdateError,
        clearDeactivateError,
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
            setError(mapErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [parent_id]);

    return { children, loading, error, loadChildren, setChildren };
}

export function useCategoryImages() {
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const uploadImage = useCallback(async (file: File): Promise<string> => {
        setUploading(true);
        setUploadError(null);
        try {
            return await uploadCategoryImage(file);
        } catch (error: any) {
            setUploadError(mapErrorMessage(error));
            throw error;
        } finally {
            setUploading(false);
        }
    }, []);

    const updateImageOnServer = useCallback(async (id: string, file: File) => {
        try {
            return await updateCategoryImage(id, file);
        } catch (error: any) {
            throw error;
        }
    }, []);

    const deleteImageFromServer = useCallback(async (id: string, image_url: string): Promise<void> => {
        setDeleting(image_url);
        setDeleteError(null);
        try {
            await deleteCategoryImage(id, image_url);
        } catch (error: any) {
            setDeleteError(mapErrorMessage(error));
            throw error;
        } finally {
            setDeleting(null);
        }
    }, []);

    const clearUploadError = () => setUploadError(null);
    const clearDeleteError = () => setDeleteError(null);

    return {
        uploadImage,
        updateImageOnServer,
        deleteImageFromServer,
        uploading,
        deleting,
        uploadError,
        deleteError,
        clearUploadError,
        clearDeleteError
    };
}