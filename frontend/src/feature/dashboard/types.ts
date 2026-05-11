export type Tab = "dashboard" | "products" | "movements" | "providers" | "catalogs" | "warehouses" | "users"

export type CatalogKind = "categories" | "brands"

export type ModalMode = "create" | "edit" | "movement" | null

export type ProductForm = {
    products_id?: number
    name: string
    description: string
    providers_id: string
    categories_id: string
    products_brands_id: string
    warehouses_id: string
    stock: string
    min_stock: string
    unit_price: string
}

export type SimpleForm = {
    id?: number
    name: string
    description: string
    location: string
    parent_id: string
    brand_name: string
}

export type UserForm = {
    name: string
    last_name: string
    email: string
    password: string
    roles_id: string
}

export type MovementForm = {
    products_id: string
    quantity: string
    movement_type: "ENTRY" | "EXIT"
}

export const emptyProduct: ProductForm = {
    name: "",
    description: "",
    providers_id: "",
    categories_id: "",
    products_brands_id: "",
    warehouses_id: "",
    stock: "0",
    min_stock: "0",
    unit_price: "0",
}

export const emptySimple: SimpleForm = {
    name: "",
    description: "",
    location: "",
    parent_id: "",
    brand_name: "",
}

export const emptyUser: UserForm = {
    name: "",
    last_name: "",
    email: "",
    password: "",
    roles_id: "1",
}

export const emptyMovement: MovementForm = {
    products_id: "",
    quantity: "1",
    movement_type: "ENTRY",
}
