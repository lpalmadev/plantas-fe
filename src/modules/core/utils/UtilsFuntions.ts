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

export const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
    };
};

export  const removetoken = () => {
    return localStorage.removeItem("token");
}

export  const removetype = () => {
    return localStorage.removeItem("type");
}