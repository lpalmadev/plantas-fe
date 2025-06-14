import { Routes, Route } from "react-router-dom";
import PublicRouter from "./routers/PublicRouter";
import PrivateRouter from "./routers/PrivateRouter";
import { ROUTES } from "./path";
import LoginPage from "../../auth/pages/LoginPage";
import Profile from "../../profile/pages/Profile";
import CatalogyPlants from "../../plants/pages/CatalogyPlants";
import UserAdminPage from "../../users/UserPage";
import ModulePage from "../../module/ModulePage";
import RolePage from "../../roles/RolePage";

export default function MainRouter() {
    return (
        <Routes>
            <Route element={<PublicRouter />}>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Route>
            <Route element={<PrivateRouter />}>
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.CATALOG_PLANTS} element={<CatalogyPlants />} />
                <Route path={ROUTES.USERS_ADMIN} element={<UserAdminPage />} />
                <Route path={ROUTES.MODULES} element={<ModulePage />} />
                <Route path={ROUTES.USER_ROLE} element={<RolePage />} />
            </Route>
        </Routes>
    );
}