import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../core/states/themeStore';
import { Category } from '../lib/types';
import { useCategoryImages } from '../hooks/useCategories';
import { ConfirmModal } from './ConfirmModal';

interface CategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, image_url?: string, parent_id?: string, is_active?: boolean) => void;
    editingCategory?: Category | null;
    parentCategory?: Category | null;
    saving?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              onSave,
                                                              editingCategory,
                                                              parentCategory,
                                                              saving = false
                                                          }) => {
    const { mode } = useThemeStore();
    const { uploadImage, deleteImageFromServer, updateImageOnServer, uploading, deleting } = useCategoryImages();

    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isActive, setIsActive] = useState(true);

    const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (editingCategory) {
                setName(editingCategory.name);
                setImageUrl(editingCategory.image_url || undefined);
                setImageFile(null);
                setIsActive(editingCategory.is_active);
            } else {
                setName('');
                setImageUrl(undefined);
                setImageFile(null);
                setIsActive(true);
            }
        }
    }, [editingCategory, isOpen]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setImageFile(files[0]);
        setImageUrl(URL.createObjectURL(files[0]));
        e.target.value = '';
    };

    const handleDeleteImageClick = () => {
        setShowDeleteImageModal(true);
    };

    const handleConfirmDeleteImage = async () => {
        if (editingCategory && imageUrl) {
            try {
                await deleteImageFromServer(editingCategory.id, imageUrl);
                setImageUrl(undefined);
                setImageFile(null);
            } catch (error) {
                alert('Error al eliminar imagen');
            }
        } else {
            setImageUrl(undefined);
            setImageFile(null);
        }
        setShowDeleteImageModal(false);
    };

    const handleCancelDeleteImage = () => {
        setShowDeleteImageModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('El nombre es requerido');
            return;
        }

        try {
            let finalImageUrl = imageUrl;
            if (
                editingCategory &&
                imageFile
            ) {
                const result = await updateImageOnServer(editingCategory.id, imageFile);
                if (result && result.image_url) {
                    finalImageUrl = result.image_url;
                    setImageUrl(finalImageUrl);
                }
            }
            onSave(name.trim(), finalImageUrl, parentCategory?.id, isActive);
        } catch (err) {
            alert('Error al actualizar la categoría o la imagen');
        }
    };

    const handleClose = () => {
        setName('');
        setImageUrl(undefined);
        setImageFile(null);
        setShowDeleteImageModal(false);
        onClose();
    };

    if (!isOpen) return null;
    const isDark = mode === 'dark';
    const isEditing = !!editingCategory;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div>
                            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {isEditing ? "Editar categoría" : "Nueva categoría"}
                            </h2>
                            {parentCategory && (
                                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Categoría hija de: {parentCategory.name}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            className={`text-gray-400 hover:text-gray-600 text-xl font-bold ${isDark ? 'hover:text-gray-200' : ''}`}
                        >
                            ✕
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                placeholder="Nombre de la categoría"
                                required
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                Imagen (opcional)
                            </label>
                            {imageUrl && (
                                <div className="mb-3 flex items-center gap-2">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded border"
                                        onClick={() => window.open(imageUrl, "_blank")}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleDeleteImageClick}
                                        disabled={deleting === imageUrl}
                                        className="bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 disabled:opacity-50 transition-colors"
                                        title="Eliminar imagen"
                                    >
                                        {deleting === imageUrl ? '⏳' : '✕'}
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white' : 'bg-white border-gray-300 file:bg-gray-50'} file:border-0 file:px-3 file:py-1 file:rounded file:text-sm file:font-medium`}
                            />
                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Formatos soportados: JPEG, PNG, GIF, WEBP.
                            </p>
                            {uploading && (
                                <div className="flex items-center gap-2 text-blue-500">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    <span className="text-sm">Subiendo imagen...</span>
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                    Estado de la categoría
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={e => setIsActive(e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-green-600"
                                        id="isActive"
                                    />
                                    <label htmlFor="isActive" className={isDark ? "text-white" : "text-gray-700"}>
                                        {isActive ? "Activa" : "Desactivada"}
                                    </label>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!name.trim() || uploading || saving}
                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {uploading ? 'Subiendo...' : saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ConfirmModal
                isOpen={showDeleteImageModal}
                title="¿Eliminar imagen?"
                message="Esta imagen se eliminará permanentemente del servidor. Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
                onConfirm={handleConfirmDeleteImage}
                onCancel={handleCancelDeleteImage}
            />
        </>
    );
};