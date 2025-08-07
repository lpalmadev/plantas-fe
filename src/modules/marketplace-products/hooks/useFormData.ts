import { useState, useEffect } from "react";
import { ProductDetail } from "../lib/types";

interface UseFormDataProps {
    product?: ProductDetail | null;
    isEdit: boolean;
    open: boolean;
    isLoadingDetail: boolean;
}

interface FormData {
    name: string;
    description: string;
    price: number;
    stock_available: number;
    shipping_price: number;
    is_active: boolean;
    has_offer: boolean;
    offer_price: number | null;
    category_id: string;
}

const initialFormData: FormData = {
    name: "",
    description: "",
    price: 0,
    stock_available: 0,
    shipping_price: 0,
    is_active: true,
    has_offer: false,
    offer_price: null,
    category_id: ""
};

export function useFormData({ product, isEdit, open, isLoadingDetail }: UseFormDataProps) {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [originalData, setOriginalData] = useState<FormData>(initialFormData);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        console.log("🔄 useFormData - Evaluando inicialización:", {
            open,
            isEdit,
            hasProduct: !!product,
            productId: product?.id,
            isLoadingDetail,
            isDataLoaded
        });

        if (!open) {
            setFormData(initialFormData);
            setOriginalData(initialFormData);
            setIsDataLoaded(false);
            return;
        }

        if (isEdit) {
            if (isLoadingDetail) {
                setIsDataLoaded(false);
                return;
            }

            if (!product) {
                setIsDataLoaded(false);
                return;
            }

            const productData = {
                name: product.name || "",
                description: product.description || "",
                price: product.price || 0,
                stock_available: product.stock_available || 0,
                shipping_price: product.shipping_price || 0,
                is_active: product.is_active ?? true,
                has_offer: product.has_offer ?? false,
                offer_price: product.offer_price || null,
                category_id: product.category?.id || ""
            };

            setOriginalData(productData);
            setFormData(productData);
            setIsDataLoaded(true);

        } else {
            setOriginalData(initialFormData);
            setFormData(initialFormData);
            setIsDataLoaded(true);
        }

    }, [open, isEdit, product?.id, product?.name, product?.description, product?.price, product?.stock_available, product?.shipping_price, product?.is_active, product?.has_offer, product?.offer_price, product?.category?.id, isLoadingDetail]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleOfferChange = (has_offer: boolean) => {
        setFormData(prev => ({
            ...prev,
            has_offer,
            offer_price: has_offer ? prev.offer_price : null
        }));
    };

    const resetFormData = () => {
        setFormData(initialFormData);
        setOriginalData(initialFormData);
        setIsDataLoaded(false);
    };

    const getChangedData = () => {
        if (!isEdit) return formData;

        const changedData: Partial<FormData> = {};
        Object.keys(formData).forEach(key => {
            const formKey = key as keyof FormData;
            if (formData[formKey] !== originalData[formKey]) {
                changedData[formKey] = formData[formKey];
            }
        });
        return changedData;
    };

    const hasChanges = () => {
        if (!isEdit) return true;
        return Object.keys(getChangedData()).length > 0;
    };

    return {
        formData,
        originalData,
        isDataLoaded,
        handleInputChange,
        handleOfferChange,
        resetFormData,
        getChangedData,
        hasChanges
    };
}