import type { LoginPayload, LoginResponse } from "../types/authTypes"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3006/autostock/api"

export const loginRequest = async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || "No se pudo iniciar sesion")
    }

    return result
}