import { LoginResponse } from "../lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints.ts";

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

    return await response.json();
}