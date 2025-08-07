"use client";

import { useState, useEffect } from "react";
import { Button } from "../../core/components/ui/button";
import { ProductDetail, CreateProductDTO, UpdateProductDTO, ProductImage } from "../lib/types";
import { useFormData } from "../hooks/useFormData";
import { ProductImageManager } from "./ProductImageManager";
import { ProductBasicInfoSection } from "./ProductBasicInfoSection";
import { ConfirmationModals } from "./ConfirmationModals";

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProductDTO | UpdateProductDTO) => Promise<void>;
    isSubmitting: boolean;
    isLoadingDetail: boolean;
    uploadImage: (file: File) => Promise<void>;
    isUploading: boolean;
    uploadedImageUrl: string | null;
    resetUploadedImage: () => void;
    product?: ProductDetail | null;
    isEdit?: boolean;
    isDark?: boolean;
}

export function ProductFormModal({
                                     open,
                                     onClose,
                                     onSubmit,
                                     isSubmitting,
                                     isLoadingDetail,
                                     uploadImage,
                                     isUploading,
                                     uploadedImageUrl,
                                     resetUploadedImage,
                                     product,
                                     isEdit = false,
                                     isDark = false
                                 }: ProductFormModalProps) {

    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [existingImages, setExistingImages] = useState<ProductImage[]>([]);

    const {
        formData,
        isDataLoaded,
        handleInputChange,
        handleOfferChange,
        resetFormData,
        getChangedData,
        hasChanges
    } = useFormData({ product, isEdit, open, isLoadingDetail });

    useEffect(() => {
        if (open && isEdit && product && !isLoadingDetail) {
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                const validImages = product.images.filter(img =>
                    img &&
                    typeof img === 'object' &&
                    img.id &&
                    img.image_url
                );
                setExistingImages(validImages);
            } else {
                setExistingImages([]);
            }
        } else if (open && !isEdit) {
            setExistingImages([]);
            resetUploadedImage();
        } else if (!open) {
            setExistingImages([]);
        }
    }, [open, isEdit, product?.id, product?.images, isLoadingDetail, resetUploadedImage]);

    useEffect(() => {
        if (!open) {
            resetUploadedImage();
            setExistingImages([]);
        }
    }, [open, resetUploadedImage]);

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.category_id) {
            alert("Por favor complete todos los campos requeridos.");
            return;
        }

        if (!isEdit && !uploadedImageUrl) {
            alert("Por favor agregue una imagen principal.");
            return;
        }

        if (formData.price <= 0) {
            alert("El precio debe ser mayor a 0.");
            return;
        }

        if (formData.stock_available < 0) {
            alert("El stock no puede ser negativo.");
            return;
        }

        if (formData.shipping_price < 0) {
            alert("El precio de envío no puede ser negativo.");
            return;
        }

        if (formData.has_offer && (!formData.offer_price || formData.offer_price >= formData.price)) {
            alert("El precio de oferta debe ser menor al precio regular.");
            return;
        }

        setShowSubmitConfirm(true);
    };

    const confirmSubmit = async () => {
        setShowSubmitConfirm(false);
        try {
            let dataToSubmit: any;

            if (isEdit) {
                dataToSubmit = getChangedData();
                if (Object.keys(dataToSubmit).length === 0) {
                    alert("No se han realizado cambios en los datos.");
                    onClose();
                    return;
                }
            } else {
                dataToSubmit = { ...formData };
                if (uploadedImageUrl) {
                    dataToSubmit.main_image = uploadedImageUrl;
                }
            }

            await onSubmit(dataToSubmit);
            resetUploadedImage();
            onClose();
        } catch (error) {
            console.error("Error al guardar producto:", error);
        }
    };

    const handleCancel = () => {
        if (isSubmitting || isUploading) return;
        setShowCancelConfirm(true);
    };

    const confirmCancel = () => {
        setShowCancelConfirm(false);
        resetUploadedImage();
        onClose();
    };

    if (!open) return null;

    if (isEdit && isLoadingDetail) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className={`w-full max-w-md rounded-lg shadow-xl p-8 text-center ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                        <h3 className="text-lg font-semibold">Cargando datos del producto...</h3>
                        <p className="text-sm opacity-70">Por favor espere</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isEdit && !isDataLoaded && !isLoadingDetail) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className={`w-full max-w-md rounded-lg shadow-xl p-8 text-center ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}>
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-4xl">⚠️</span>
                        <h3 className="text-lg font-semibold">No se pudieron cargar los datos</h3>
                        <p className="text-sm opacity-70">Intente cerrar y abrir nuevamente</p>
                        <Button onClick={onClose} variant="outline">
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}>
                    <div className="border-b p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{isEdit ? "Editar" : "Agregar"} Producto</h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                                disabled={isSubmitting || isUploading}
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
                        <ProductImageManager
                            isEdit={isEdit}
                            existingImages={existingImages}
                            setExistingImages={setExistingImages}
                            productId={product?.id}
                            mainImage={product?.main_image}
                            uploadedImageUrl={uploadedImageUrl}
                            uploadImage={uploadImage}
                            isUploading={isUploading}
                            isDark={isDark}
                        />

                        <ProductBasicInfoSection
                            formData={formData}
                            onInputChange={handleInputChange}
                            onOfferChange={handleOfferChange}
                            isDark={isDark}
                        />

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting || isUploading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isUploading ||
                                    (!isEdit && !uploadedImageUrl) ||
                                    (isEdit && !isDataLoaded)}
                            >
                                {isSubmitting ? "Guardando..." : "Aceptar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmationModals
                showCancelConfirm={showCancelConfirm}
                showSubmitConfirm={showSubmitConfirm}
                isEdit={isEdit}
                isSubmitting={isSubmitting}
                onCancelConfirm={confirmCancel}
                onSubmitConfirm={confirmSubmit}
                onCloseCancelModal={() => setShowCancelConfirm(false)}
                onCloseSubmitModal={() => setShowSubmitConfirm(false)}
                isDark={isDark}
            />
        </>
    );
}