import { Outlet, Navigate } from "react-router-dom";

const isAuthenticated = false;

export default function PrivateRouter() {
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}