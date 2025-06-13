export async function loginAdminService(email: string, password: string) {
    const response = await fetch("https://jardindeploy.onrender.com/auth/login-admin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Credenciales incorrectas");
    }

    const data = await response.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
    }

    if (data.user?.type) {
        localStorage.setItem("type", data.user.type)
    }

    return data;
}