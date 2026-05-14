const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3006/autostock/api"

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: unknown
}

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}${path}`, {
        method: options.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const text = await response.text()
    let payload: any = null

    try {
        payload = text ? JSON.parse(text) : null
    } catch {
        const fallbackMessage = response.ok
            ? "La respuesta del servidor no tiene un formato valido"
            : `No se pudo completar la solicitud (${response.status})`
        throw new Error(fallbackMessage)
    }

    if (!response.ok) {
        throw new Error(payload?.message || payload?.error || "No se pudo completar la solicitud")
    }

    return payload as T
}

export const currentUserRole = (): number => {
    const stored = localStorage.getItem("user")
    if (!stored) return 99
    try {
        return Number(JSON.parse(stored)?.roles_id ?? 99)
    } catch {
        return 99
    }
}

export const currentUserId = () => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) return 1

    try {
        const user = JSON.parse(storedUser)
        return Number(user.users_id ?? user.id ?? 1)
    } catch {
        return 1
    }
}
