export const API_ENDPOINTS = {
    LOGIN_ADMIN: "https://jardindeploy.onrender.com/auth/login-admin",
    ROLES: "https://jardindeploy.onrender.com/roles",
    MODULE: "https://jardindeploy.onrender.com/modules",
    MODULE_BY_ID: (id: string) => `https://jardindeploy.onrender.com/modules/${id}`,
    ADMIN_USERS: "https://jardindeploy.onrender.com/admin/users",
};