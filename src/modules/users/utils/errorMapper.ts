interface ErrorMap {
    [key: string]: string;
}

const errorMapping: ErrorMap = {
    "Name must be between 2 and 100 characters": "El nombre debe tener entre 2 y 100 caracteres.",
    "Name is required": "El nombre es obligatorio.",
    "Lastname must be between 2 and 100 characters": "El apellido debe tener entre 2 y 100 caracteres.",
    "Lastname is required": "El apellido es obligatorio.",
    "Email already registered": "El correo electrónico ya está registrado.",
    "Invalid email format": "El formato del correo electrónico es inválido.",
    "Email must be between 5 and 150 characters": "El correo electrónico debe tener entre 5 y 150 caracteres.",
    "Birthdate must be a valid date in ISO 8601 format": "La fecha de nacimiento debe tener formato válido (ISO 8601).",
    "Birthdate is required": "La fecha de nacimiento es obligatoria.",
    "Phone must contain only numbers": "El teléfono solo puede contener números.",
    "Phone must be between 8 and 15 characters": "El teléfono debe tener entre 8 y 15 caracteres.",
    "Phone is required": "El teléfono es obligatorio.",
    "Role ID must be a valid UUID": "El rol seleccionado no es válido.",
    "Role ID is required": "El rol es obligatorio.",
};

export function mapUserErrorMessage(error: any): string {
    if (Array.isArray(error?.message)) {
        return error.message.map((msg: string) => errorMapping[msg] || msg).join(' ');
    }
    if (typeof error?.message === 'string') {
        return errorMapping[error.message] || error.message;
    }
    return "Ocurrió un error inesperado.";
}