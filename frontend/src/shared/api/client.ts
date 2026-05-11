const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3006/autostock/api"

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: unknown
}

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
        method: options.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const text = await response.text()
    const payload = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(payload?.message || payload?.error || "No se pudo completar la solicitud")
    }

    return payload as T
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
