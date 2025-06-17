import { LoginResponse } from "../lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints.ts";
import { setAuthToken, setUserType } from "../../core/utils/UtilsFuntions.ts";

export async function loginAdminService(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(API_ENDPOINTS.LOGIN_ADMIN, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Credenciales incorrectas");
    }

    const data = await response.json();

    if (data.token) setAuthToken(data.token);
    if (data.user?.type) setUserType(data.user.type);

    return data;
}