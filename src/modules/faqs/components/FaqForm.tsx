import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../core/states/themeStore';
import { Faq, FaqType, FaqContent } from '../lib/types';
import { uploadImage, deleteImage } from '../services/faqService';
import { ConfirmModal } from './ConfirmModal';

interface FaqFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (content: FaqContent, type: FaqType, parentId?: string) => void;
    editingFaq?: Faq | null;
    parentFaq?: Faq | null;
    defaultType?: FaqType;
}

export const FaqForm: React.FC<FaqFormProps> = ({
                                                    isOpen,
                                                    onClose,
                                                    onSave,
                                                    editingFaq,
                                                    parentFaq,
                                                    defaultType = 'pregunta',
                                                }) => {
    const { mode } = useThemeStore();
    const [text, setText] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [type, setType] = useState<FaqType>(defaultType);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<{url: string, index: number} | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (editingFaq) {
                setText(editingFaq.content.text);
                setImages(editingFaq.content.image_url || []);
                setType(editingFaq.type);
            } else {
                setText('');
                setImages([]);
                setType(parentFaq ? (parentFaq.type === 'pregunta' ? 'respuesta' : 'pregunta') : 'pregunta');
            }
        }
    }, [editingFaq, parentFaq, defaultType, isOpen]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const results = await Promise.all(uploadPromises);
            const newUrls = results.flat();

            setImages(prev => [...prev, ...newUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error al subir imágenes');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDeleteImageClick = (url: string, index: number) => {
        setImageToDelete({ url, index });
        setShowDeleteImageModal(true);
    };

    const handleConfirmDeleteImage = async () => {
        if (!imageToDelete) return;

        setDeleting(imageToDelete.url);
        setShowDeleteImageModal(false);

        try {
            await deleteImage(imageToDelete.url);
            setImages(prev => prev.filter((_, i) => i !== imageToDelete.index));
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error al eliminar imagen');
        } finally {
            setDeleting(null);
            setImageToDelete(null);
        }
    };

    const handleCancelDeleteImage = () => {
        setShowDeleteImageModal(false);
        setImageToDelete(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            alert('El contenido es requerido');
            return;
        }

        const content: FaqContent = {
            text: text.trim(),
            image_url: images,
        };

        onSave(content, type, parentFaq?.id);
    };

    const handleClose = () => {
        setText('');
        setImages([]);
        setType('pregunta');
        setShowDeleteImageModal(false);
        setImageToDelete(null);
        onClose();
    };

    if (!isOpen) return null;

    const isDark = mode === 'dark';

    const isEditing = !!editingFaq;
    const isChild = !!parentFaq;
    const showTypeSelector = !isEditing && !isChild;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div>
                            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {editingFaq ? `Editar ${editingFaq.type}` : `Nuevo ${type}`}
                            </h2>
                            {parentFaq && (
                                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {parentFaq.type === 'pregunta' ? 'Respuesta para' : 'Pregunta para'}: {parentFaq.content.text.slice(0, 50)}...
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

                        {showTypeSelector && (
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                    Tipo de FAQ
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as FaqType)}
                                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                >
                                    <option value="pregunta">Pregunta</option>
                                </select>
                                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Los FAQs principales siempre comienzan como preguntas
                                </p>
                            </div>
                        )}

                        {(isEditing || isChild) && (
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                    Tipo de FAQ
                                </label>
                                <div className={`p-3 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                                    <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {type === 'pregunta' ? '❓' : '✅'}
                    </span>
                                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                                        <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                      {isEditing ? 'No editable' : 'Automático'}
                    </span>
                                    </div>
                                    {isChild && (
                                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Tipo determinado automáticamente: {parentFaq?.type} → {type}
                                        </p>
                                    )}
                                    {isEditing && (
                                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            El tipo no se puede cambiar durante la edición
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                Contenido de la {type}
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={5}
                                className={`w-full p-3 border rounded resize-none focus:ring-2 focus:ring-green-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                placeholder={`Escribe el contenido de la ${type} aquí...`}
                                required
                            />
                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Mínimo 5 caracteres requeridos
                            </p>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                Imágenes (opcional)
                            </label>

                            {images.length > 0 && (
                                <div className="mb-3">
                                    <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Imágenes actuales ({images.length}):
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {images.map((url, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-20 h-20 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                                                    onClick={() => window.open(url, '_blank')}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImageClick(url, idx)}
                                                    disabled={deleting === url}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 disabled:opacity-50 transition-colors"
                                                    title="Eliminar imagen"
                                                >
                                                    {deleting === url ? '⏳' : '✕'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    multiple
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white' : 'bg-white border-gray-300 file:bg-gray-50'} file:border-0 file:px-3 file:py-1 file:rounded file:text-sm file:font-medium`}
                                />
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Formatos soportados: JPEG, PNG, GIF, WEBP. Máximo 5MB por imagen.
                                </p>
                                {uploading && (
                                    <div className="flex items-center gap-2 text-blue-500">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        <span className="text-sm">Subiendo imágenes...</span>
                                    </div>
                                )}
                            </div>
                        </div>

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
                                disabled={!text.trim() || uploading}
                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {uploading ? 'Subiendo...' : editingFaq ? 'Actualizar' : 'Crear'}
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