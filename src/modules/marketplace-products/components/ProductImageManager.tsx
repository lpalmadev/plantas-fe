"use client";

import { Button } from "../../core/components/ui/button";
import { ProductImage } from "../lib/types";
import { useImageManager } from "../hooks/useImageManager";
import { ImageUploadSection } from "./ImageUploadSection";
import { useProductStore } from "../states/productStore";

interface ProductImageManagerProps {
    isEdit: boolean;
    existingImages: ProductImage[];
    setExistingImages: (images: ProductImage[] | ((prev: ProductImage[]) => ProductImage[])) => void;
    productId?: string;
    mainImage?: string | null;
    uploadedImageUrl: string | null;
    uploadImage: (file: File) => Promise<void>;
    isUploading: boolean;
    isDark?: boolean;
}

export function ProductImageManager({
                                        isEdit,
                                        existingImages,
                                        setExistingImages,
                                        productId,
                                        mainImage,
                                        uploadedImageUrl,
                                        uploadImage,
                                        isUploading,
                                        isDark = false
                                    }: ProductImageManagerProps) {
    const fetchProducts = useProductStore(state => state.fetchProducts);

    const {
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
        setShowImageDeleteConfirm,
        setShowImageUpdateConfirm,
        setShowImageAddConfirm,
        setShowMainImageDeleteConfirm,
        setShowMainImageUpdateConfirm,
    } = useImageManager({
        existingImages,
        setExistingImages,
        productId,
        fetchProducts
    });

    if (isEdit) {
        return (
            <>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Gestión de Imágenes</h3>

                    <div className={`p-4 mb-4 border rounded-md ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                        <h4 className="font-semibold mb-2">Imagen Principal</h4>
                        {mainImage ? (
                            <div className="flex items-start gap-4">
                                <div className="relative">
                                    <img
                                        src={`${mainImage}?t=${Date.now()}`}
                                        alt="Imagen principal"
                                        className="w-32 h-32 object-cover rounded-md border"
                                    />
                                    {processingImageAction === "main" && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-md">
                                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setShowMainImageUpdateConfirm(e.target.files[0]);
                                            }
                                        }}
                                        className={`text-sm ${
                                            isDark ? 'text-gray-300' : 'text-gray-700'
                                        }`}
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => setShowMainImageDeleteConfirm(true)}
                                        disabled={!!processingImageAction}
                                    >
                                        🗑️ Eliminar imagen principal
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <span className="text-4xl mb-2 block">📷</span>
                                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    No hay imagen principal
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setShowMainImageUpdateConfirm(e.target.files[0]);
                                        }
                                    }}
                                    className={`text-sm ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                                />
                            </div>
                        )}
                    </div>

                    <div className={`p-4 mb-4 border rounded-md ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                        <h4 className="font-semibold mb-2">Actualizar una imagen secundaria</h4>
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1">
                                <input
                                    id="updateImageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageFileChange(e, true)}
                                    className={`w-full py-1 px-2 border rounded ${
                                        isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                                    }`}
                                />
                            </div>
                            <p className="text-sm italic">
                                1. Selecciona una nueva imagen, luego 2. Haz clic en el botón 📝 sobre la imagen que deseas reemplazar
                            </p>
                        </div>
                    </div>

                    {existingImages.length > 0 ? (
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Imágenes Secundarias ({existingImages.length})</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {existingImages.map((img) => (
                                    <div
                                        key={img.id}
                                        className={`relative h-28 rounded-md overflow-hidden border group ${
                                            isDark ? 'border-gray-600' : 'border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={`${img.image_url}?t=${Date.now()}`}
                                            alt="Imagen de producto"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => setShowImageDeleteConfirm(img.id)}
                                                    disabled={!!processingImageAction}
                                                    className="w-10 h-8 text-xs"
                                                >
                                                    🗑️
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => prepareUpdateImage(img.id)}
                                                    disabled={!!processingImageAction || !selectedImage}
                                                    className={`w-10 h-8 text-xs ${
                                                        isDark ? 'bg-blue-700 hover:bg-blue-600 text-white border-blue-600' : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                                                    } ${!selectedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    📝
                                                </Button>
                                            </div>
                                        </div>
                                        {processingImageAction === img.id && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                                                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className={`mb-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'} bg-yellow-100/20 p-3 rounded`}>
                            ⚠️ No hay imágenes secundarias para este producto.
                        </p>
                    )}

                    <div className={`mt-4 p-4 border rounded-md ${isDark ? 'border-green-700 bg-green-900/20' : 'border-green-200 bg-green-50'}`}>
                        <h4 className="font-semibold mb-2">Añadir nueva imagen secundaria</h4>
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1">
                                <input
                                    id="addImageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageFileChange(e, false)}
                                    className={`w-full py-1 px-2 border rounded ${
                                        isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                                    }`}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="default"
                                onClick={confirmAddImageToProduct}
                                disabled={!imageToAddToProduct || !!processingImageAction}
                                className={`${isDark ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-500'}`}
                            >
                                {processingImageAction === "add" ? (
                                    <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
                                ) : null}
                                Añadir Imagen
                            </Button>
                        </div>
                    </div>
                </div>

                {showMainImageDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                        <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <h3 className="text-lg font-semibold mb-4">¿Eliminar imagen principal?</h3>
                            <p className="text-sm mb-6">
                                ¿Está seguro que desea eliminar la imagen principal? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowMainImageDeleteConfirm(false)}>No</Button>
                                <Button variant="destructive" onClick={handleDeleteMainImage}>Sí, eliminar</Button>
                            </div>
                        </div>
                    </div>
                )}

                {showMainImageUpdateConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                        <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <h3 className="text-lg font-semibold mb-4">¿Actualizar imagen principal?</h3>
                            <p className="text-sm mb-6">
                                ¿Confirma que desea reemplazar la imagen principal con la nueva imagen seleccionada?
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowMainImageUpdateConfirm(null)}>No</Button>
                                <Button variant="default" onClick={() => handleUpdateMainImage(showMainImageUpdateConfirm)}>Sí, actualizar</Button>
                            </div>
                        </div>
                    </div>
                )}

                {showImageDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                        <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <h3 className="text-lg font-semibold mb-4">¿Eliminar imagen?</h3>
                            <p className="text-sm mb-6">
                                ¿Está seguro que desea eliminar esta imagen secundaria? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowImageDeleteConfirm(null)}>No</Button>
                                <Button variant="destructive" onClick={() => handleDeleteSecondaryImage(showImageDeleteConfirm!)}>Sí, eliminar</Button>
                            </div>
                        </div>
                    </div>
                )}

                {showImageAddConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                        <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <h3 className="text-lg font-semibold mb-4">¿Añadir imagen?</h3>
                            <p className="text-sm mb-6">
                                ¿Confirma que desea añadir esta imagen secundaria al producto?
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowImageAddConfirm(false)}>No</Button>
                                <Button variant="default" onClick={handleAddImageToProduct}>Sí, añadir</Button>
                            </div>
                        </div>
                    </div>
                )}

                {showImageUpdateConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                        <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <h3 className="text-lg font-semibold mb-4">¿Actualizar imagen?</h3>
                            <p className="text-sm mb-6">
                                ¿Confirma que desea reemplazar la imagen actual con la nueva imagen seleccionada?
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowImageUpdateConfirm(null)}>No</Button>
                                <Button variant="default" onClick={handleUpdateSecondaryImage}>Sí, actualizar</Button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <ImageUploadSection
            uploadedImageUrl={uploadedImageUrl}
            onUpload={uploadImage}
            isUploading={isUploading}
            isDark={isDark}
        />
    );
}