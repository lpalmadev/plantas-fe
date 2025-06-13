import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import AuthGreenPanel from "../../core/components/background/AuthGreenPanel";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();

    const handleLoginSuccess = () => {
        navigate("/catalogo-plantas");
    };

    return (
        <div className="min-h-screen flex">
            <AuthGreenPanel />
            <div className="flex flex-1 items-center justify-center bg-white px-4">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
                        Iniciar Sesión
                    </h2>
                    <LoginForm
                        onLoginSuccess={handleLoginSuccess}
                        loading={loading}
                        error={error}
                        login={login}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;