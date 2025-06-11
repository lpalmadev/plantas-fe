import { Routes, Route } from "react-router-dom";
import LoginPage from "../../auth/pages/LoginPage";
import PublicRouter from "./routers/PublicRouter";
import PrivateRouter from "./routers/PrivateRouter";
import { ROUTES } from "./path";

export default function MainRouter() {
    return (
        <Routes>
            <Route element={<PublicRouter />}>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Route>
            <Route element={<PrivateRouter />}>
            </Route>
        </Routes>
    );
}