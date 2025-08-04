import { Category } from "./types";

export function buildCategoryTree(categories: Category[], parentId?: string): Category[] {
    return categories
        .filter(cat => cat.parent_id === parentId)
        .map(cat => ({
            ...cat,
            children: buildCategoryTree(categories, cat.id)
        }));
}

export function flattenCategoryTree(categories: Category[]): Category[] {
    const result: Category[] = [];

    function traverse(catList: any[]) {
        catList.forEach(cat => {
            result.push(cat);
            if (cat.children) {
                traverse(cat.children);
            }
        });
    }

    traverse(categories);
    return result;
}

export function findCategoryById(categories: Category[], id: string): Category | null {
    for (const cat of categories) {
        if (cat.id === id) return cat;
        if ((cat as any).children) {
            const found = findCategoryById((cat as any).children, id);
            if (found) return found;
        }
    }
    return null;
}