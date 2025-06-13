import { useForm } from "react-hook-form";

const roles = [
    { id: "ADMIN", name: "Administrador" },
    { id: "EDITOR", name: "Editor" },
    { id: "USER", name: "Usuario" }
];

interface UserCreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmitSuccess?: (data: any) => void;
}

export function UserCreateModal({ open, onClose, onSubmitSuccess }: UserCreateModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data: any) => {
        if (onSubmitSuccess) onSubmitSuccess(data);
        reset();
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 relative">
                {/* Header compacto */}
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Crear nuevo usuario</h2>
                    <button
                        className="text-gray-400 hover:text-red-500 text-xl transition-colors"
                        onClick={() => { reset(); onClose(); }}
                        aria-label="Cerrar"
                        type="button"
                    >×</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <div>
                        <label className="block mb-1 font-semibold text-base">Nombre</label>
                        <input
                            type="text"
                            {...register("firstName", { required: "El nombre es obligatorio" })}
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.firstName ? "border-red-400" : "border-gray-300"
                            }`}
                            autoComplete="off"
                        />
                        {errors.firstName && (
                            <span className="text-red-500 text-xs">{errors.firstName.message as string}</span>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-base">Apellido</label>
                        <input
                            type="text"
                            {...register("lastName", { required: "El apellido es obligatorio" })}
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.lastName ? "border-red-400" : "border-gray-300"
                            }`}
                            autoComplete="off"
                        />
                        {errors.lastName && (
                            <span className="text-red-500 text-xs">{errors.lastName.message as string}</span>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-base">Correo</label>
                        <input
                            type="email"
                            placeholder="ejemplo@correo.com"
                            {...register("email", {
                                required: "El correo es obligatorio",
                                pattern: {
                                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: "Correo inválido"
                                }
                            })}
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.email ? "border-red-400" : "border-gray-300"
                            }`}
                            autoComplete="off"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-xs">{errors.email.message as string}</span>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-base">Fecha de cumpleaños</label>
                        <input
                            type="date"
                            placeholder="dd/mm/aaaa"
                            {...register("birthday", { required: "La fecha de cumpleaños es obligatoria" })}
                            className={`w-full border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.birthday ? "border-red-400" : "border-gray-300"
                            }`}
                        />
                        {errors.birthday && (
                            <span className="text-red-500 text-xs">{errors.birthday.message as string}</span>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-base">Rol</label>
                        <select
                            {...register("role", { required: "El rol es obligatorio" })}
                            className={`w-full border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.role ? "border-red-400" : "border-gray-300"
                            }`}
                            defaultValue=""
                        >
                            <option value="" disabled>Selecciona un rol</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <span className="text-red-500 text-xs">{errors.role.message as string}</span>
                        )}
                    </div>
                    {/* Botones */}
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={() => { reset(); onClose(); }}
                            className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold transition"
                        >
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}