export type StatusRecord = {
    active?: boolean
}

export type Product = StatusRecord & {
    products_id: number
    name?: string
    product_name?: string
    description?: string
    providers_id?: number
    provider_name?: string
    categories_id?: number
    category_name?: string
    products_brands_id?: number
    brand_name?: string
    warehouses_id?: number
    warehouse_name?: string
    stock?: number
    min_stock?: number
    unit_price?: number | string
}

export type Provider = StatusRecord & {
    providers_id: number
    name: string
    description?: string
}

export type Category = {
    categories_id: number
    name: string
    description?: string
    parent_id?: number | null
}

export type Brand = {
    products_brands_id: number
    brand_name: string
}

export type Warehouse = {
    warehouses_id: number
    name: string
    location?: string
}

export type Movement = {
    products_movements_id: number
    products_id: number
    product_name?: string
    name?: string
    quantity: number
    movement_type: "ENTRY" | "EXIT" | string
    created_by?: number
    created_by_name?: string
    created_at?: string
}

export type UserRecord = StatusRecord & {
    users_id: number
    name: string
    last_name: string
    email: string
    roles_id?: number
    role_id?: number
    role_name?: string
}
