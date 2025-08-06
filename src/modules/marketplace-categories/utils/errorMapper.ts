interface ErrorMap {
    [key: string]: string;
}

const errorMapping: ErrorMap = {
    "Name must be a string": "El nombre debe ser un texto válido.",
    "Name is required": "El nombre es obligatorio.",
    "Name must be between 2 and 100 characters": "El nombre debe tener entre 2 y 100 caracteres.",
    "Parent ID must be a string": "El ID de la categoría padre debe ser un texto válido.",
    "Parent ID must be a valid UUID": "El ID de la categoría padre debe ser un UUID válido.",
    "Image URL must be a string": "La URL de la imagen debe ser un texto válido.",
    "Image URL cannot exceed 500 characters": "La URL de la imagen no puede exceder 500 caracteres.",
    "Is active must be a boolean": "El estado activo debe ser verdadero o falso.",
    "No file provided": "Debe seleccionar un archivo de imagen.",
};

export function mapErrorMessage(error: any): string {
    if (Array.isArray(error?.message)) {
        return error.message.map((msg: string) => errorMapping[msg] || msg).join('. ');
    }

    if (typeof error?.message === 'string') {
        return errorMapping[error.message] || error.message;
    }

    if (typeof error === 'string') {
        return errorMapping[error] || error;
    }

    return "Ocurrió un error inesperado.";
}