import { useState, useCallback } from "react";
import { useFaqStore } from "../states/faqStore";
import { Faq, FaqType, FaqContent } from "../lib/types";
import {
    fetchFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
    uploadImage,
    deleteImage
} from "../services/faqService";

export function useFaqs() {
    const { faqs, loading, error, loadFaqs, setFaqs, setLoading, setError } = useFaqStore();

    const refetch = useCallback(() => {
        loadFaqs();
    }, [loadFaqs]);

    return {
        faqs,
        loading,
        error,
        refetch,
        loadFaqs
    };
}

export function useFaqOperations() {
    const { loadFaqs } = useFaqStore();
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    const createFaqItem = useCallback(async (type: FaqType, content: FaqContent, parentId?: string) => {
        setSaving(true);
        try {
            await createFaq(type, content, parentId);
            await loadFaqs();
        } catch (error) {
            console.error('Error creating FAQ:', error);
            throw error;
        } finally {
            setSaving(false);
        }
    }, [loadFaqs]);

    const updateFaqItem = useCallback(async (id: string, content: FaqContent) => {
        setSaving(true);
        try {
            await updateFaq(id, content);
            await loadFaqs();
        } catch (error) {
            console.error('Error updating FAQ:', error);
            throw error;
        } finally {
            setSaving(false);
        }
    }, [loadFaqs]);

    const deleteFaqItem = useCallback(async (id: string) => {
        setDeleting(id);
        try {
            await deleteFaq(id);
            await loadFaqs();
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            throw error;
        } finally {
            setDeleting(null);
        }
    }, [loadFaqs]);

    return {
        createFaqItem,
        updateFaqItem,
        deleteFaqItem,
        saving,
        deleting
    };
}

export function useFaqChildren(parentId?: string) {
    const [children, setChildren] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadChildren = useCallback(async () => {
        if (!parentId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await fetchFaqs(parentId);
            setChildren(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [parentId]);

    return {
        children,
        loading,
        error,
        loadChildren,
        setChildren
    };
}

export function useFaqImages() {
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
        setUploading(true);
        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const results = await Promise.all(uploadPromises);
            return results.flat();
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        } finally {
            setUploading(false);
        }
    }, []);

    const deleteImageFromServer = useCallback(async (url: string): Promise<void> => {
        setDeleting(url);
        try {
            await deleteImage(url);
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        } finally {
            setDeleting(null);
        }
    }, []);

    return {
        uploadImages,
        deleteImageFromServer,
        uploading,
        deleting
    };
}