import { Outlet, Navigate } from "react-router-dom";

// Pon la autenticación en true para pruebas, luego implementas la real (entender biien esta perte y como funciona)
const isAuthenticated = true;

export default function PrivateRouter() {
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}