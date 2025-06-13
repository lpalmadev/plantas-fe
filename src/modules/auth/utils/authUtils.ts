export const setAuthToken = (token: string): void => {
    localStorage.setItem("token", token);
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
};

export const setUserType = (type: string): void => {
    localStorage.setItem("type", type);
};

export const getUserType = (): string | null => {
    return localStorage.getItem("type");
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};