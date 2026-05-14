import { useEffect, useMemo, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import { toast } from "sonner"
import { apiRequest, currentUserId } from "../../shared/api/client"
import type { Brand, Category, Movement, Product, Provider, UserRecord, Warehouse as WarehouseType } from "../../shared/types/inventory"
import { AppModal } from "./components/common"
import { MovementFormView, ProductFormView, SimpleFormView, UserFormView } from "./components/forms"
import { DashboardSidebar, DashboardTopbar, navItems } from "./components/navigation"
import { DashboardProvider } from "./context"
import { emptyMovement, emptyProduct, emptySimple, emptyUser } from "./types"
import type { CatalogKind, ModalMode, SimpleForm, Tab } from "./types"
import { getProductName, modalTitle } from "./utils"

const pathToTab = (pathname: string): Tab => {
    return navItems.find((item) => pathname.startsWith(item.path))?.id ?? "dashboard"
}

const MainPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const activeTab = pathToTab(location.pathname)
    const [catalogKind, setCatalogKind] = useState<CatalogKind>("categories")
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [modalMode, setModalMode] = useState<ModalMode>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [providers, setProviders] = useState<Provider[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [warehouses, setWarehouses] = useState<WarehouseType[]>([])
    const [movements, setMovements] = useState<Movement[]>([])
    const [users, setUsers] = useState<UserRecord[]>([])
    const [productForm, setProductForm] = useState(emptyProduct)
    const [simpleForm, setSimpleForm] = useState(emptySimple)
    const [userForm, setUserForm] = useState(emptyUser)
    const [movementForm, setMovementForm] = useState(emptyMovement)

    const user = useMemo(() => {
        const stored = localStorage.getItem("user")
        if (!stored) return null
        try {
            return JSON.parse(stored) as UserRecord
        } catch {
            return null
        }
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const isAdmin = user?.roles_id === 1

            const [productData, providerData, categoryData, brandData, warehouseData, movementData, userData] = await Promise.all([
                apiRequest<Product[]>("/products"),
                apiRequest<Provider[]>("/providers"),
                apiRequest<Category[]>("/categories"),
                apiRequest<Brand[]>("/brands"),
                apiRequest<WarehouseType[]>("/warehouses"),
                apiRequest<Movement[]>("/movements"),
                isAdmin ? apiRequest<UserRecord[]>("/users") : Promise.resolve([] as UserRecord[]),
            ])

            setProducts(productData)
            setProviders(providerData)
            setCategories(categoryData)
            setBrands(brandData)
            setWarehouses(warehouseData)
            setMovements(movementData)
            setUsers(userData)
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo cargar la informacion"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        setQuery("")
    }, [location.pathname])

    const closeModal = () => {
        setModalMode(null)
        setProductForm(emptyProduct)
        setSimpleForm(emptySimple)
        setUserForm(emptyUser)
        setMovementForm(emptyMovement)
    }

    const openProductModal = (product?: Product) => {
        if (product) {
            setProductForm({
                products_id: product.products_id,
                name: getProductName(product),
                description: product.description ?? "",
                providers_id: String(product.providers_id ?? ""),
                categories_id: String(product.categories_id ?? ""),
                products_brands_id: String(product.products_brands_id ?? ""),
                warehouses_id: String(product.warehouses_id ?? ""),
                stock: String(product.stock ?? 0),
                min_stock: String(product.min_stock ?? 0),
                unit_price: String(product.unit_price ?? 0),
            })
            setModalMode("edit")
            return
        }

        setProductForm(emptyProduct)
        setModalMode("create")
    }

    const openSimpleModal = (form: SimpleForm) => {
        setSimpleForm(form)
        setModalMode("edit")
    }

    const openUserModal = (userRecord?: UserRecord) => {
        if (userRecord) {
            setUserForm({
                users_id: userRecord.users_id,
                name: userRecord.name,
                last_name: userRecord.last_name,
                email: userRecord.email,
                password: "",
                roles_id: String(userRecord.roles_id ?? userRecord.role_id ?? "1"),
            })
            setModalMode("edit")
            return
        }
        setUserForm(emptyUser)
        setModalMode("create")
    }

    const saveProduct = async () => {
        const payload = {
            name: productForm.name,
            description: productForm.description,
            providers_id: Number(productForm.providers_id),
            categories_id: Number(productForm.categories_id),
            products_brands_id: Number(productForm.products_brands_id),
            warehouses_id: Number(productForm.warehouses_id),
            stock: Number(productForm.stock),
            min_stock: Number(productForm.min_stock),
            unit_price: Number(productForm.unit_price),
            active: true,
            created_by: currentUserId(),
            updated_by: currentUserId(),
            created_at: new Date(),
            updated_at: new Date(),
        }

        try {
            if (productForm.products_id) {
                await apiRequest(`/products/${productForm.products_id}`, { method: "PUT", body: payload })
                toast.success("Producto actualizado")
            } else {
                await apiRequest("/products", { method: "POST", body: payload })
                toast.success("Producto creado")
            }
            closeModal()
            loadData()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "No se pudo guardar el producto")
        }
    }

    const saveSimpleResource = async () => {
        const now = new Date()
        const creator = currentUserId()
        const config = {
            providers: {
                path: "/providers",
                id: simpleForm.id,
                payload: { name: simpleForm.name, description: simpleForm.description, active: true, created_by: creator, updated_by: creator, created_at: now, updated_at: now },
            },
            warehouses: {
                path: "/warehouses",
                id: simpleForm.id,
                payload: { name: simpleForm.name, location: simpleForm.location },
            },
            categories: {
                path: "/categories",
                id: simpleForm.id,
                payload: { name: simpleForm.name, description: simpleForm.description, parent_id: simpleForm.parent_id ? Number(simpleForm.parent_id) : undefined },
            },
            brands: {
                path: "/brands",
                id: simpleForm.id,
                payload: { brand_name: simpleForm.brand_name, created_by: creator, updated_by: creator, created_at: now, updated_at: now },
            },
        }

        const key = activeTab === "providers" ? "providers" : activeTab === "warehouses" ? "warehouses" : catalogKind
        const selected = config[key]

        try {
            if (selected.id) {
                await apiRequest(`${selected.path}/${selected.id}`, { method: "PUT", body: selected.payload })
                toast.success("Registro actualizado")
            } else {
                await apiRequest(selected.path, { method: "POST", body: selected.payload })
                toast.success("Registro creado")
            }
            closeModal()
            loadData()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "No se pudo guardar")
        }
    }

    const saveUser = async () => {
        try {
            if (userForm.users_id) {
                const body: Record<string, unknown> = { name: userForm.name, last_name: userForm.last_name, roles_id: Number(userForm.roles_id) }
                if (userForm.password) body.password = userForm.password
                await apiRequest(`/users/${userForm.users_id}`, { method: "PUT", body })
                toast.success("Usuario actualizado")
            } else {
                await apiRequest("/users", {
                    method: "POST",
                    body: { ...userForm, roles_id: Number(userForm.roles_id), active: true, created_at: new Date() },
                })
                toast.success("Usuario creado")
            }
            closeModal()
            loadData()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "No se pudo guardar el usuario")
        }
    }

    const saveMovement = async () => {
        const pid = Number(movementForm.products_id)
        const qty = Number(movementForm.quantity)
        if (!pid || qty < 1) {
            toast.error("Selecciona un producto y una cantidad válida")
            return
        }
        const isEntry = movementForm.movement_type === "ENTRY"
        try {
            await apiRequest(`/movements/${isEntry ? "entry" : "exit"}`, {
                method: "POST",
                body: { products_id: pid, quantity: qty, created_by: currentUserId(), created_at: new Date() },
            })
            toast.success(isEntry ? "Entrada registrada" : "Salida registrada")
            closeModal()
            loadData()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "No se pudo registrar el movimiento")
        }
    }

    const toggleStatus = async (path: string, method: "PATCH" | "PUT" = "PATCH") => {
        try {
            await apiRequest(path, { method })
            toast.success("Estatus actualizado")
            loadData()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "No se pudo actualizar el estatus")
        }
    }

    const deleteResource = async (path: string) => {
        try {
            await apiRequest(path, { method: "DELETE" })
            toast.success("Registro eliminado")
            loadData()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "No se pudo eliminar")
        }
    }

    const logout = () => {
        localStorage.clear()
        navigate("/")
    }

    return (
        <DashboardProvider
            value={{
                query,
                setQuery,
                isLoading,
                catalogKind,
                setCatalogKind,
                products,
                providers,
                categories,
                brands,
                warehouses,
                movements,
                users,
                productForm,
                setProductForm,
                simpleForm,
                setSimpleForm,
                userForm,
                setUserForm,
                movementForm,
                setMovementForm,
                setModalMode,
                loadData,
                openProductModal,
                openSimpleModal,
                openUserModal,
                saveProduct,
                saveSimpleResource,
                saveUser,
                saveMovement,
                toggleStatus,
                deleteResource,
            }}
        >
            <main className="app-shell">
                <DashboardSidebar onLogout={logout} />

                <section className="workspace">
                    <DashboardTopbar activeTab={activeTab} user={user} />
                    <Outlet />
                </section>

                <AppModal isOpen={modalMode !== null} title={modalTitle(activeTab, catalogKind, modalMode)} onClose={closeModal}>
                    {modalMode === "movement" && (
                        <MovementFormView form={movementForm} products={products} setForm={setMovementForm} onSave={saveMovement} />
                    )}

                    {activeTab === "products" && modalMode !== "movement" && (
                        <ProductFormView form={productForm} providers={providers} categories={categories} brands={brands} warehouses={warehouses} setForm={setProductForm} onSave={saveProduct} />
                    )}

                    {activeTab === "users" && modalMode !== "movement" && (
                        <UserFormView form={userForm} setForm={setUserForm} onSave={saveUser} />
                    )}

                    {activeTab !== "products" && activeTab !== "users" && activeTab !== "movements" && modalMode !== "movement" && (
                        <SimpleFormView activeTab={activeTab} catalogKind={catalogKind} form={simpleForm} categories={categories} setForm={setSimpleForm} onSave={saveSimpleResource} />
                    )}
                </AppModal>
            </main>
        </DashboardProvider>
    )
}

export default MainPage
