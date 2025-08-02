interface ErrorMap {
    [key: string]: string;
}

const errorMapping: ErrorMap = {
    "Device with this identifier already exists": "Ya existe un dispositivo con este identificador.",
    "Device identifier already exists": "Ya existe un dispositivo con este identificador.",
    "Identifier can only contain letters, numbers, hyphens and underscores": "El identificador solo puede contener letras, números, guiones y guiones bajos.",
    "Identifier must be between 1 and 100 characters": "El identificador debe tener entre 1 y 100 caracteres.",
    "Identifier is required": "El identificador es obligatorio.",
    "Cannot change linked device to available": "No se puede cambiar el estado de un dispositivo vinculado a disponible.",
    "Device is already linked": "El dispositivo ya está vinculado.",
    "Device is disabled": "El dispositivo está deshabilitado."
};

export function mapErrorMessage(error: any): string {
    if (Array.isArray(error?.message)) {
        return error.message.map((msg: string) => errorMapping[msg] || msg).join(' ');
    }
    if (typeof error?.message === 'string') {
        return errorMapping[error.message] || error.message;
    }
    return "Ocurrió un error inesperado.";
}