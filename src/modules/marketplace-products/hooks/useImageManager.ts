import { useState } from "react";
import { ProductImage } from "../lib/types";
import { productService } from "../services/productService";

interface UseImageManagerProps {
    existingImages: ProductImage[];
    setExistingImages: (images: ProductImage[] | ((prev: ProductImage[]) => ProductImage[])) => void;
    fetchProducts?: () => void;
    productId?: string;
}
export function useImageManager({ existingImages, setExistingImages, productId, fetchProducts }: UseImageManagerProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageToAddToProduct, setImageToAddToProduct] = useState<File | null>(null);
    const [processingImageAction, setProcessingImageAction] = useState<string | null>(null);

    const [showImageDeleteConfirm, setShowImageDeleteConfirm] = useState<string | null>(null);
    const [showImageUpdateConfirm, setShowImageUpdateConfirm] = useState<{ id: string, file: File } | null>(null);
    const [showImageAddConfirm, setShowImageAddConfirm] = useState(false);
    const [showMainImageDeleteConfirm, setShowMainImageDeleteConfirm] = useState(false);
    const [showMainImageUpdateConfirm, setShowMainImageUpdateConfirm] = useState<File | null>(null);

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, isForUpdate: boolean = false) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            if (isForUpdate) {
                setSelectedImage(file);
            } else {
                setImageToAddToProduct(file);
            }
        }
    };

    const prepareUpdateImage = (imageId: string) => {
        if (selectedImage) {
            setShowImageUpdateConfirm({ id: imageId, file: selectedImage });
        } else {
            alert("Por favor selecciona una imagen primero");
        }
    };

    const handleUpdateSecondaryImage = async () => {
        if (!showImageUpdateConfirm || !productId) return;
        const { id, file } = showImageUpdateConfirm;
        setShowImageUpdateConfirm(null);
        setProcessingImageAction(id);

        try {
            await productService.updateSecondaryImage(productId, id, file);

            const updatedProduct = await productService.getProductById(productId);
            setExistingImages(updatedProduct.images || []);

            setSelectedImage(null);
            const fileInput = document.getElementById('updateImageInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            alert("Imagen actualizada correctamente");

        } catch (error) {
            console.error("Error al actualizar imagen:", error);
            alert("Error al actualizar la imagen: " + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setProcessingImageAction(null);
        }
    };

    const confirmAddImageToProduct = () => {
        setShowImageAddConfirm(true);
    };

    const handleAddImageToProduct = async () => {
        if (!productId || !imageToAddToProduct) {
            console.error("❌ Faltan datos:", { productId, hasFile: !!imageToAddToProduct });
            alert("Error: Faltan datos para añadir la imagen");
            return;
        }

        setShowImageAddConfirm(false);
        setProcessingImageAction("add");

        try {
            await productService.addSecondaryImage(productId, imageToAddToProduct);

            const updatedProduct = await productService.getProductById(productId);
            setExistingImages(updatedProduct.images || []);

            setImageToAddToProduct(null);
            const fileInput = document.getElementById('addImageInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            alert("Imagen añadida correctamente");

        } catch (error) {
            console.error("Error al añadir imagen:", error);
            alert("Error al añadir la imagen: " + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setProcessingImageAction(null);
        }
    };

    const handleDeleteSecondaryImage = async (imageId: string) => {
        setShowImageDeleteConfirm(null);
        setProcessingImageAction(imageId);

        try {
            if (!productId) throw new Error("Product ID no disponible");

            await productService.deleteSecondaryImage(productId, imageId);

            const updatedProduct = await productService.getProductById(productId);
            setExistingImages(updatedProduct.images || []);

            if (fetchProducts) fetchProducts();
            alert("Imagen eliminada correctamente");

        } catch (error) {
            console.error("Error al eliminar imagen:", error);
            alert("Error al eliminar la imagen: " + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setProcessingImageAction(null);
        }
    };

    const handleUpdateMainImage = async (file: File) => {
        if (!productId) return;
        setShowMainImageUpdateConfirm(null);
        setProcessingImageAction("main");

        try {
            await productService.updateMainImage(productId, file);

            if (fetchProducts) fetchProducts();
            alert("Imagen principal actualizada correctamente");

        } catch (error) {
            console.error("Error al actualizar imagen principal:", error);
            alert("Error al actualizar la imagen principal: " + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setProcessingImageAction(null);
        }
    };

    const handleDeleteMainImage = async () => {
        if (!productId) return;
        setShowMainImageDeleteConfirm(false);
        setProcessingImageAction("main");

        try {
            await productService.deleteMainImage(productId);

            if (fetchProducts) fetchProducts();
            alert("Imagen principal eliminada correctamente");

        } catch (error) {
            console.error("Error al eliminar imagen principal:", error);
            alert("Error al eliminar la imagen principal: " + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setProcessingImageAction(null);
        }
    };

    const resetImageStates = () => {
        setSelectedImage(null);
        setImageToAddToProduct(null);
        setProcessingImageAction(null);
        setShowImageDeleteConfirm(null);
        setShowImageUpdateConfirm(null);
        setShowImageAddConfirm(false);
        setShowMainImageDeleteConfirm(false);
        setShowMainImageUpdateConfirm(null);
    };

    return {
        selectedImage,
        imageToAddToProduct,
        processingImageAction,
        showImageDeleteConfirm,
        showImageUpdateConfirm,
        showImageAddConfirm,
        showMainImageDeleteConfirm,
        showMainImageUpdateConfirm,

        handleImageFileChange,
        prepareUpdateImage,
        handleUpdateSecondaryImage,
        confirmAddImageToProduct,
        handleAddImageToProduct,
        handleDeleteSecondaryImage,
        handleUpdateMainImage,
        handleDeleteMainImage,
        resetImageStates,

        setShowImageDeleteConfirm,
        setShowImageUpdateConfirm,
        setShowImageAddConfirm,
        setShowMainImageDeleteConfirm,
        setShowMainImageUpdateConfirm,
    };
}