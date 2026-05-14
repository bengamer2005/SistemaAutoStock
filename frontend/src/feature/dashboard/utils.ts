import type { Movement, Product } from "../../shared/types/inventory"
import type { CatalogKind, ModalMode, Tab } from "./types"

export const money = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
})

export const getProductName = (product: Product) => product.name || product.product_name || `Producto ${product.products_id}`

export const getMovementProduct = (movement: Movement) => movement.product_name || movement.name || `Producto ${movement.products_id}`

export const modalTitle = (activeTab: Tab, catalogKind: CatalogKind, modalMode: ModalMode) => {
    if (modalMode === "movement") return "Registrar movimiento"
    if (activeTab === "products") return modalMode === "edit" ? "Editar producto" : "Nuevo producto"
    if (activeTab === "providers") return modalMode === "edit" ? "Editar proveedor" : "Nuevo proveedor"
    if (activeTab === "warehouses") return modalMode === "edit" ? "Editar almacen" : "Nuevo almacen"
    if (activeTab === "users") return modalMode === "edit" ? "Editar usuario" : "Nuevo usuario"
    return catalogKind === "brands" ? "Marca" : "Categoria"
}

export const formatDate = (date?: string) => {
    if (!date) return "-"
    return new Date(date).toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
    })
}
