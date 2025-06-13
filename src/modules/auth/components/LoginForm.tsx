import { useState } from "react";
import { Button } from "../../core/components/ui/button";

interface LoginFormProps {
    onLoginSuccess: () => void;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
}

export const LoginForm = ({ onLoginSuccess, loading, error, login }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(email, password);
            onLoginSuccess();
        } catch (err) {

        }
    };

    return (
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
    );
};