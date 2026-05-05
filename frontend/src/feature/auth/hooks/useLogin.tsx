import { useMutation } from "@tanstack/react-query"
import { loginRequest } from "../services/authService"
import type { LoginPayload } from "../types/authTypes"

export const useAuth = () => {
    return useMutation({
        mutationFn: (data: LoginPayload) => loginRequest(data),

        onSuccess: (data) => {
            // guardar token
            localStorage.setItem("token", data.token)

            // opcional guardar user
            localStorage.setItem("user", JSON.stringify(data.user))
        }
    })
}