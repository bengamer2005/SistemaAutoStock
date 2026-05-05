const APIs = import.meta.env.VITE_API_URL
import type { LoginPayload, LoginResponse } from "../types/authTypes"

console.log("API URL:", APIs)

export const loginRequest = async ( data: LoginPayload ): Promise<LoginResponse> => {
    const response = await fetch(`${APIs}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || "Login failed")
    }

    return result
}