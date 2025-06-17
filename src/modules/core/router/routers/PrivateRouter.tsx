import { Outlet, Navigate } from "react-router-dom";

const isAuthenticated = true;

export default function PrivateRouter() {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}