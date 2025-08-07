"use client";

import { Button } from "../../core/components/ui/button";

interface DeleteConfirmationModalProps {
    open: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    confirmText?: string;
    cancelText?: string;
    isDark?: boolean;
}

export function DeleteConfirmationModal({
                                            open,
                                            title,
                                            message,
                                            onCancel,
                                            onConfirm,
                                            isDeleting,
                                            confirmText = "Sí, eliminar",
                                            cancelText = "No",
                                            isDark = false
                                        }: DeleteConfirmationModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
            <div className={`max-w-md w-full rounded-lg p-6 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}>
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <p className="text-sm mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={confirmText.includes("Restaurar") ? "default" : "destructive"}  // ✅ AGREGADO
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className={confirmText.includes("Restaurar") ? "bg-green-600 hover:bg-green-700" : ""}  // ✅ AGREGADO
                    >
                        {isDeleting ? "Procesando..." : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}