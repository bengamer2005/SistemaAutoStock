import { createContext, useContext } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { Brand, Category, Movement, Product, Provider, UserRecord, Warehouse as WarehouseType } from "../../shared/types/inventory"
import type { CatalogKind, MovementForm, ModalMode, ProductForm, SimpleForm, UserForm } from "./types"

export type DashboardContextValue = {
    query: string
    setQuery: Dispatch<SetStateAction<string>>
    isLoading: boolean
    catalogKind: CatalogKind
    setCatalogKind: Dispatch<SetStateAction<CatalogKind>>
    products: Product[]
    providers: Provider[]
    categories: Category[]
    brands: Brand[]
    warehouses: WarehouseType[]
    movements: Movement[]
    users: UserRecord[]
    productForm: ProductForm
    setProductForm: Dispatch<SetStateAction<ProductForm>>
    simpleForm: SimpleForm
    setSimpleForm: Dispatch<SetStateAction<SimpleForm>>
    userForm: UserForm
    setUserForm: Dispatch<SetStateAction<UserForm>>
    movementForm: MovementForm
    setMovementForm: Dispatch<SetStateAction<MovementForm>>
    setModalMode: Dispatch<SetStateAction<ModalMode>>
    loadData: () => Promise<void>
    openProductModal: (product?: Product) => void
    openSimpleModal: (form: SimpleForm) => void
    openUserModal: (user?: UserRecord) => void
    saveProduct: () => Promise<void>
    saveSimpleResource: () => Promise<void>
    saveUser: () => Promise<void>
    saveMovement: () => Promise<void>
    toggleStatus: (path: string, method?: "PATCH" | "PUT") => Promise<void>
    deleteResource: (path: string) => Promise<void>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export const DashboardProvider = DashboardContext.Provider

export const useDashboard = () => {
    const context = useContext(DashboardContext)
    if (!context) {
        throw new Error("useDashboard debe usarse dentro de DashboardProvider")
    }
    return context
}
