import { useState } from "react";
import AuthGreenPanel from "../../core/components/background/AuthGreenPanel";
import { Button } from "../../core/components/ui/button";
import { loginAdminService } from "../services/loginAdminService";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await loginAdminService(email, password);
            alert("¡Inicio de sesión exitoso!");
            // Aquí puedes redirigir si lo necesitas(poner el panel plantas)
        } catch (err: any) {
            console.error("Error en login:", err);
            setError(err.message || "Ocurrió un error de autenticación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <AuthGreenPanel />
            <div className="flex flex-1 items-center justify-center bg-white px-4">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
                        Iniciar Sesión
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        autoComplete="off"
                        id="login-form"
                    >
                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-1">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="correo@ejemplo.com"
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                aria-label="Correo electrónico"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                aria-label="Contraseña"
                            />
                        </div>
                        {error && (
                            <div className="text-red-600 bg-red-100 rounded px-3 py-2 text-sm">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                            id="login-submit"
                        >
                            {loading ? "Entrando..." : "Iniciar sesión"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
