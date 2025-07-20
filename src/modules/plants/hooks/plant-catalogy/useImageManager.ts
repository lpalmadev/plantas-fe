import { useState } from "react";
import {type PlantCatalogFilters, PlantImage} from "../../lib/plant-catalogy/types";
import { plantCatalogService } from "../../services/plant-catalogy/plantCatalogService";

interface UseImageManagerProps {
    existingImages: PlantImage[];
    setExistingImages: (images: PlantImage[] | ((prev: PlantImage[]) => PlantImage[])) => void;
    fetchPlants?: () => void;
    plantId?: string;
}
export function useImageManager({ existingImages, setExistingImages, plantId, fetchPlants }: UseImageManagerProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageToAddToPlant, setImageToAddToPlant] = useState<File | null>(null);
    const [processingImageAction, setProcessingImageAction] = useState<string | null>(null);

    const [showImageDeleteConfirm, setShowImageDeleteConfirm] = useState<string | null>(null);
    const [showImageUpdateConfirm, setShowImageUpdateConfirm] = useState<{ id: string, file: File } | null>(null);
    const [showImageAddConfirm, setShowImageAddConfirm] = useState(false);

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, isForUpdate: boolean = false) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            if (isForUpdate) {
                setSelectedImage(file);
            } else {
                setImageToAddToPlant(file);
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

    const handleUpdateImage = async () => {
        if (!showImageUpdateConfirm) return;
        const { id, file } = showImageUpdateConfirm;
        setShowImageUpdateConfirm(null);
        setProcessingImageAction(id);

        try {
            const formDataImage = new FormData();
            formDataImage.append('image', file);

            const updatedImage = await plantCatalogService.updateImageFile(id, formDataImage);

            const updatedPlant = await plantCatalogService.getPlantById(plantId, true);

            setExistingImages(updatedPlant.images || []);

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

    const confirmAddImageToPlant = () => {
        setShowImageAddConfirm(true);
    };

    const handleAddImageToPlant = async () => {
        if (!plantId || !imageToAddToPlant) {
            console.error("❌ Faltan datos:", { plantId, hasFile: !!imageToAddToPlant });
            alert("Error: Faltan datos para añadir la imagen");
            return;
        }

        setShowImageAddConfirm(false);
        setProcessingImageAction("add");

        try {
            const formDataImage = new FormData();
            formDataImage.append('image', imageToAddToPlant);

            await plantCatalogService.addImageToPlant(plantId, formDataImage);

            const updatedPlant = await plantCatalogService.getPlantById(plantId, true);

            setExistingImages(updatedPlant.images || []);

            setImageToAddToPlant(null);
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

    const handleDeleteImage = async (imageId: string) => {
        setShowImageDeleteConfirm(null);
        setProcessingImageAction(imageId);

        try {
            await plantCatalogService.deleteImage(imageId);
            const updatedPlant = await plantCatalogService.getPlantById(plantId, true);

            setExistingImages(updatedPlant.images || []);

            if (fetchPlants) fetchPlants();
            alert("Imagen eliminada correctamente");

        } catch (error) {
            console.error("Error al eliminar imagen:", error);
            alert("Error al eliminar la imagen: " + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setProcessingImageAction(null);
        }
    };

    const resetImageStates = () => {
        setSelectedImage(null);
        setImageToAddToPlant(null);
        setProcessingImageAction(null);
        setShowImageDeleteConfirm(null);
        setShowImageUpdateConfirm(null);
        setShowImageAddConfirm(false);
    };

    return {
        selectedImage,
        imageToAddToPlant,
        processingImageAction,
        showImageDeleteConfirm,
        showImageUpdateConfirm,
        showImageAddConfirm,

        handleImageFileChange,
        prepareUpdateImage,
        handleUpdateImage,
        confirmAddImageToPlant,
        handleAddImageToPlant,
        handleDeleteImage,
        resetImageStates,

        setShowImageDeleteConfirm,
        setShowImageUpdateConfirm,
        setShowImageAddConfirm,
    };
}