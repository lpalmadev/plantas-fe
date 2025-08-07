"use client";

import { useState, useRef } from "react";
import { Button } from "../../core/components/ui/button";

interface ImageUploadSectionProps {
    uploadedImageUrl: string | null;
    onUpload: (file: File) => void;
    isUploading: boolean;
    isDark?: boolean;
}

export function ImageUploadSection({
                                       uploadedImageUrl,
                                       onUpload,
                                       isUploading,
                                       isDark = false
                                   }: ImageUploadSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files[0]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Imagen principal del producto</h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Selecciona la imagen principal que aparecerá en el catálogo de productos.
            </p>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {uploadedImageUrl && (
                <div className="mb-4">
                    <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Imagen cargada:
                    </p>
                    <div className="relative h-32 w-32 rounded-md overflow-hidden border">
                        <img
                            src={uploadedImageUrl}
                            alt="Imagen cargada"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                        ? (isDark ? 'border-blue-500 bg-blue-900/10' : 'border-blue-500 bg-blue-50')
                        : (isDark ? 'border-gray-600' : 'border-gray-300')
                }`}
            >
                <div className="text-6xl mb-4">📷</div>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {uploadedImageUrl
                        ? "Selecciona una nueva imagen para reemplazar la actual"
                        : "Selecciona o arrastra una imagen para el producto"}
                </p>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleClickUpload}
                    disabled={isUploading}
                >
                    {isUploading ? "Procesando..." : "Seleccionar imagen"}
                </Button>
            </div>
        </div>
    );
}