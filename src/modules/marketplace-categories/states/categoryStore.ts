import { create } from "zustand";
import { Category } from "../lib/types";
import { fetchCategories, fetchAllCategoriesWithHierarchy, flattenCategoryHierarchy, CategoryWithHierarchy } from "../services/categoryService";
import { mapErrorMessage } from "../utils/errorMapper";

interface CategoryState {
    categories: Category[];
    categoriesHierarchy: CategoryWithHierarchy[];
    flatCategories: CategoryWithHierarchy[];
    loading: boolean;
    error: string | null;
    loadCategories: () => Promise<void>;
    loadAllCategoriesWithHierarchy: () => Promise<void>;
    setCategories: (categories: Category[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearState: () => void;
    clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    categoriesHierarchy: [],
    flatCategories: [],
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
            set({
                error: mapErrorMessage(error),
                loading: false,
                categories: []
            });
        }
    },

    loadAllCategoriesWithHierarchy: async () => {
        const state = get();
        if (state.loading) return;
        set({ loading: true, error: null });
        try {
            const categoriesHierarchy = await fetchAllCategoriesWithHierarchy();
            const flatCategories = flattenCategoryHierarchy(categoriesHierarchy);
            set({
                categoriesHierarchy,
                flatCategories,
                loading: false
            });
        } catch (error: any) {
            set({
                error: mapErrorMessage(error),
                loading: false,
                categoriesHierarchy: [],
                flatCategories: []
            });
        }
    },

    setCategories: (categories: Category[]) => set({ categories }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    clearState: () => set({
        categories: [],
        categoriesHierarchy: [],
        flatCategories: [],
        loading: false,
        error: null
    }),
    clearError: () => set({ error: null }),
}));