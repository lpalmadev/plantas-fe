import React, { useEffect, useState } from 'react';
import { useThemeStore } from '../../core/states/themeStore';
import { useAuthStore } from '../../core/states/authStore';
import { useFaqs, useFaqOperations } from '../hooks/useFaqs';
import { FaqItem } from '../components/FaqItem';
import { FaqForm } from '../components/FaqForm';
import { Faq, FaqType, FaqContent } from '../lib/types';

const FaqsPage: React.FC = () => {
    const { mode } = useThemeStore();
    const { isAuthenticated } = useAuthStore();
    const { faqs, loading, error, refetch } = useFaqs();
    const { createFaqItem, updateFaqItem, deleteFaqItem, saving, deleting } = useFaqOperations();

    const [showForm, setShowForm] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [parentFaq, setParentFaq] = useState<Faq | null>(null);
    const [defaultType, setDefaultType] = useState<FaqType>('pregunta');

    useEffect(() => {
        if (isAuthenticated) {
            refetch();
        }
    }, [isAuthenticated, refetch]);

    const handleEdit = (faq: Faq) => {
        setEditingFaq(faq);
        setParentFaq(null);
        setShowForm(true);
    };

    const handleAddChild = (parent: Faq, type: FaqType) => {
        setEditingFaq(null);
        setParentFaq(parent);
        setDefaultType(type);
        setShowForm(true);
    };

    const handleDelete = async (faq: Faq) => {
        try {
            await deleteFaqItem(faq.id);
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            alert('Error al eliminar FAQ');
        }
    };

    const handleSave = async (content: FaqContent, type: FaqType, parentId?: string) => {
        try {
            if (editingFaq) {
                await updateFaqItem(editingFaq.id, content);
            } else {
                await createFaqItem(type, content, parentId);
            }
            handleCloseForm();
        } catch (error) {
            console.error('Error saving FAQ:', error);
            alert('Error al guardar FAQ');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingFaq(null);
        setParentFaq(null);
    };

    const handleNewFaq = () => {
        setEditingFaq(null);
        setParentFaq(null);
        setDefaultType('pregunta');
        setShowForm(true);
    };

    const handleRefresh = () => {
        refetch();
    };

    if (!isAuthenticated) {
        return (
            <div className={mode === "dark" ? "dark bg-[#151E2A] min-h-screen" : "bg-white min-h-screen"}>
                <div className="flex items-center justify-center min-h-screen p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                        <div className="text-red-500 text-6xl mb-4">🔒</div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Acceso Restringido
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Debes iniciar sesión para acceder a la gestión de FAQs.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const isDark = mode === 'dark';
    const rootFaqs = faqs.filter(faq => !faq.parentId);

    return (
        <div className={mode === "dark" ? "dark bg-[#151E2A] min-h-screen" : "bg-white min-h-screen"}>
            <div className="p-6">
                <div className={`max-w-5xl mx-auto rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div>
                            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Gestión de FAQs
                            </h1>
                            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Sistema de preguntas y respuestas en acordeón
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                                Actualizar
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
                                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Cargando FAQs...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                                <h3 className="text-lg font-semibold text-red-600 mb-2">
                                    Error al cargar FAQs
                                </h3>
                                <p className="text-red-500 mb-4">{error}</p>
                                <button
                                    onClick={handleRefresh}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : rootFaqs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">❓</div>
                                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    No hay FAQs creados
                                </h3>
                                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Comienza creando tu primer FAQ para ayudar a los usuarios
                                </p>
                                <button
                                    onClick={handleNewFaq}
                                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Crear primer FAQ
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {rootFaqs.map((faq) => (
                                    <FaqItem
                                        key={faq.id}
                                        faq={faq}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onAddChild={handleAddChild}
                                        isDeleting={deleting === faq.id}
                                    />
                                ))}
                            </div>
                        )}

                        {deleting && (
                            <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Eliminando FAQ...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FaqForm
                isOpen={showForm}
                onClose={handleCloseForm}
                onSave={handleSave}
                editingFaq={editingFaq}
                parentFaq={parentFaq}
                defaultType={defaultType}
                saving={saving}
            />

            {saving && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                        <span className="text-gray-900 dark:text-white">
                            {editingFaq ? 'Actualizando FAQ...' : 'Creando FAQ...'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FaqsPage;