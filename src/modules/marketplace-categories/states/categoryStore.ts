import { create } from "zustand";
import { Category } from "../lib/types";
import { fetchCategories } from "../services/categoryService";

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
    loadCategories: () => Promise<void>;
    setCategories: (categories: Category[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearState: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    loading: false,
    error: null,

    loadCategories: async () => {
        const state = get();
        if (state.loading) return;
        set({ loading: true, error: null });
        try {
            const categories = await fetchCategories();
            set({ categories, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false, categories: [] });
        }
    },

    setCategories: (categories: Category[]) => set({ categories }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    clearState: () => set({ categories: [], loading: false, error: null }),
}));