// types/authTypes.ts
export type LoginPayload = {
    email: string
    password: string
}

export type User = {
    users_id: number
    name: string
    last_name: string
    email: string
    role_id: number
    active: boolean
}

export type LoginResponse = {
    message: string
    token: string
    user: User
}