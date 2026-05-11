import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
    Archive,
    Boxes,
    Building2,
    Factory,
    Layers3,
    LogOut,
    Package,
    Pencil,
    Plus,
    RefreshCcw,
    Search,
    ShieldCheck,
    Trash2,
    TrendingDown,
    TrendingUp,
    Users,
    Warehouse,
} from "lucide-react"
import { toast } from "sonner"
import { apiRequest, currentUserId } from "../../shared/api/client"
import type { Brand, Category, Movement, Product, Provider, UserRecord, Warehouse as WarehouseType } from "../../shared/types/inventory"

type Tab = "dashboard" | "products" | "movements" | "providers" | "catalogs" | "warehouses" | "users"
type CatalogKind = "categories" | "brands"
type ModalMode = "create" | "edit" | "movement" | null

type ProductForm = {
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

type SimpleForm = {
    id?: number
    name: string
    description: string
    location: string
    parent_id: string
    brand_name: string
}

type UserForm = {
    name: string
    last_name: string
    email: string
    password: string
    roles_id: string
}

type MovementForm = {
    products_id: string
    quantity: string
    movement_type: "ENTRY" | "EXIT"
}

const emptyProduct: ProductForm = {
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

const emptySimple: SimpleForm = {
    name: "",
    description: "",
    location: "",
    parent_id: "",
    brand_name: "",
}

const emptyUser: UserForm = {
    name: "",
    last_name: "",
    email: "",
    password: "",
    roles_id: "1",
}

const emptyMovement: MovementForm = {
    products_id: "",
    quantity: "1",
    movement_type: "ENTRY",
}

const money = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
})

const getProductName = (product: Product) => product.name || product.product_name || `Producto ${product.products_id}`
const getMovementProduct = (movement: Movement) => movement.product_name || movement.name || `Producto ${movement.products_id}`

const navItems: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
    { id: "dashboard", label: "Panel", icon: Archive },
    { id: "products", label: "Productos", icon: Package },
    { id: "movements", label: "Movimientos", icon: RefreshCcw },
    { id: "providers", label: "Proveedores", icon: Factory },
    { id: "catalogs", label: "Catalogos", icon: Layers3 },
    { id: "warehouses", label: "Almacenes", icon: Warehouse },
    { id: "users", label: "Usuarios", icon: Users },
]

const MainPage = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<Tab>("dashboard")
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
    const [productForm, setProductForm] = useState<ProductForm>(emptyProduct)
    const [simpleForm, setSimpleForm] = useState<SimpleForm>(emptySimple)
    const [userForm, setUserForm] = useState<UserForm>(emptyUser)
    const [movementForm, setMovementForm] = useState<MovementForm>(emptyMovement)

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
            const [productData, providerData, categoryData, brandData, warehouseData, movementData, userData] = await Promise.all([
                apiRequest<Product[]>("/products"),
                apiRequest<Provider[]>("/providers"),
                apiRequest<Category[]>("/categories"),
                apiRequest<Brand[]>("/brands"),
                apiRequest<WarehouseType[]>("/warehouses"),
                apiRequest<Movement[]>("/movements"),
                apiRequest<UserRecord[]>("/users"),
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

    const lowStockProducts = products.filter((product) => Number(product.stock ?? 0) <= Number(product.min_stock ?? 0))
    const activeProducts = products.filter((product) => product.active !== false)
    const inventoryValue = products.reduce((total, product) => {
        return total + Number(product.stock ?? 0) * Number(product.unit_price ?? 0)
    }, 0)

    const filteredProducts = products.filter((product) => {
        const text = `${getProductName(product)} ${product.description ?? ""} ${product.provider_name ?? ""} ${product.category_name ?? ""}`.toLowerCase()
        return text.includes(query.toLowerCase())
    })

    const filteredProviders = providers.filter((provider) => {
        return `${provider.name} ${provider.description ?? ""}`.toLowerCase().includes(query.toLowerCase())
    })

    const filteredWarehouses = warehouses.filter((warehouse) => {
        return `${warehouse.name} ${warehouse.location ?? ""}`.toLowerCase().includes(query.toLowerCase())
    })

    const filteredUsers = users.filter((item) => {
        return `${item.name} ${item.last_name} ${item.email} ${item.role_name ?? ""}`.toLowerCase().includes(query.toLowerCase())
    })

    const filteredMovements = movements.filter((movement) => {
        return `${getMovementProduct(movement)} ${movement.movement_type}`.toLowerCase().includes(query.toLowerCase())
    })

    const filteredCategories = categories.filter((category) => {
        return `${category.name} ${category.description ?? ""}`.toLowerCase().includes(query.toLowerCase())
    })

    const filteredBrands = brands.filter((brand) => {
        return brand.brand_name.toLowerCase().includes(query.toLowerCase())
    })

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
                payload: {
                    name: simpleForm.name,
                    description: simpleForm.description,
                    active: true,
                    created_by: creator,
                    updated_by: creator,
                    created_at: now,
                    updated_at: now,
                },
            },
            warehouses: {
                path: "/warehouses",
                id: simpleForm.id,
                payload: { name: simpleForm.name, location: simpleForm.location },
            },
            categories: {
                path: "/categories",
                id: simpleForm.id,
                payload: {
                    name: simpleForm.name,
                    description: simpleForm.description,
                    parent_id: simpleForm.parent_id ? Number(simpleForm.parent_id) : undefined,
                },
            },
            brands: {
                path: "/brands",
                id: simpleForm.id,
                payload: {
                    brand_name: simpleForm.brand_name,
                    created_by: creator,
                    updated_by: creator,
                    created_at: now,
                    updated_at: now,
                },
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
            await apiRequest("/users", {
                method: "POST",
                body: {
                    ...userForm,
                    roles_id: Number(userForm.roles_id),
                    active: true,
                    created_at: new Date(),
                },
            })
            toast.success("Usuario creado")
            closeModal()
            loadData()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "No se pudo crear el usuario")
        }
    }

    const saveMovement = async () => {
        try {
            await apiRequest(`/movements/${movementForm.movement_type === "ENTRY" ? "entry" : "exit"}`, {
                method: "POST",
                body: {
                    products_id: Number(movementForm.products_id),
                    quantity: Number(movementForm.quantity),
                    created_by: currentUserId(),
                    created_at: new Date(),
                },
            })
            toast.success(movementForm.movement_type === "ENTRY" ? "Entrada registrada" : "Salida registrada")
            closeModal()
            loadData()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "No se pudo registrar el movimiento")
        }
    }

    const toggleStatus = async (path: string) => {
        try {
            await apiRequest(path, { method: "PATCH" })
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
        <main className="app-shell">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <Boxes size={28} />
                    <span>AutoStock</span>
                </div>

                <nav>
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.id}
                                className={activeTab === item.id ? "nav-item active" : "nav-item"}
                                onClick={() => {
                                    setActiveTab(item.id)
                                    setQuery("")
                                }}
                            >
                                <Icon size={19} />
                                {item.label}
                            </button>
                        )
                    })}
                </nav>

                <button className="nav-item logout" onClick={logout}>
                    <LogOut size={19} />
                    Salir
                </button>
            </aside>

            <section className="workspace">
                <header className="topbar">
                    <div>
                        <span className="eyebrow">SistemaAutoStock</span>
                        <h1>{navItems.find((item) => item.id === activeTab)?.label}</h1>
                    </div>

                    <div className="user-pill">
                        <ShieldCheck size={18} />
                        <span>{user ? `${user.name} ${user.last_name}` : "Usuario"}</span>
                    </div>
                </header>

                {activeTab === "dashboard" && (
                    <section className="content-grid">
                        <StatCard icon={Package} label="Productos activos" value={activeProducts.length} />
                        <StatCard icon={TrendingDown} label="Bajo minimo" value={lowStockProducts.length} tone="warning" />
                        <StatCard icon={Building2} label="Almacenes" value={warehouses.length} />
                        <StatCard icon={TrendingUp} label="Valor inventario" value={money.format(inventoryValue)} />

                        <div className="panel wide">
                            <div className="panel-header">
                                <div>
                                    <h2>Productos con bajo stock</h2>
                                    <p>Articulos que requieren revision de existencia.</p>
                                </div>
                                <button className="secondary-button" onClick={loadData}>
                                    <RefreshCcw size={16} />
                                    Actualizar
                                </button>
                            </div>
                            <DataTable
                                rows={lowStockProducts.slice(0, 8)}
                                empty="No hay productos bajo el minimo."
                                columns={[
                                    ["Producto", (item) => getProductName(item)],
                                    ["Stock", (item) => item.stock ?? 0],
                                    ["Minimo", (item) => item.min_stock ?? 0],
                                    ["Proveedor", (item) => item.provider_name ?? "-"],
                                ]}
                            />
                        </div>
                    </section>
                )}

                {activeTab !== "dashboard" && (
                    <section className="panel">
                        <div className="panel-header">
                            <SearchBox value={query} onChange={setQuery} />
                            <HeaderActions
                                activeTab={activeTab}
                                catalogKind={catalogKind}
                                setCatalogKind={setCatalogKind}
                                onCreate={() => {
                                    if (activeTab === "products") openProductModal()
                                    else if (activeTab === "movements") setModalMode("movement")
                                    else setModalMode("create")
                                }}
                                onRefresh={loadData}
                            />
                        </div>

                        {isLoading ? (
                            <div className="loading-state">Cargando informacion...</div>
                        ) : (
                            <>
                                {activeTab === "products" && (
                                    <DataTable
                                        rows={filteredProducts}
                                        empty="No se encontraron productos."
                                        columns={[
                                            ["Producto", (item) => getProductName(item)],
                                            ["Stock", (item) => <StockBadge product={item} />],
                                            ["Precio", (item) => money.format(Number(item.unit_price ?? 0))],
                                            ["Proveedor", (item) => item.provider_name ?? "-"],
                                            ["Estatus", (item) => <StatusBadge active={item.active !== false} />],
                                            [
                                                "Acciones",
                                                (item) => (
                                                    <RowActions
                                                        onEdit={() => openProductModal(item)}
                                                        onToggle={() => toggleStatus(`/products/${item.products_id}/status`)}
                                                    />
                                                ),
                                            ],
                                        ]}
                                    />
                                )}

                                {activeTab === "movements" && (
                                    <DataTable
                                        rows={filteredMovements}
                                        empty="No se encontraron movimientos."
                                        columns={[
                                            ["Producto", (item) => getMovementProduct(item)],
                                            ["Tipo", (item) => <MovementBadge type={item.movement_type} />],
                                            ["Cantidad", (item) => item.quantity],
                                            ["Fecha", (item) => formatDate(item.created_at)],
                                        ]}
                                    />
                                )}

                                {activeTab === "providers" && (
                                    <DataTable
                                        rows={filteredProviders}
                                        empty="No se encontraron proveedores."
                                        columns={[
                                            ["Proveedor", (item) => item.name],
                                            ["Descripcion", (item) => item.description || "-"],
                                            ["Estatus", (item) => <StatusBadge active={item.active !== false} />],
                                            [
                                                "Acciones",
                                                (item) => (
                                                    <RowActions
                                                        onEdit={() => {
                                                            setSimpleForm({
                                                                ...emptySimple,
                                                                id: item.providers_id,
                                                                name: item.name,
                                                                description: item.description ?? "",
                                                            })
                                                            setModalMode("edit")
                                                        }}
                                                        onToggle={() => toggleStatus(`/providers/${item.providers_id}/status`)}
                                                    />
                                                ),
                                            ],
                                        ]}
                                    />
                                )}

                                {activeTab === "catalogs" && catalogKind === "categories" && (
                                    <DataTable
                                        rows={filteredCategories}
                                        empty="No se encontraron categorias."
                                        columns={[
                                            ["Categoria", (item) => item.name],
                                            ["Descripcion", (item) => item.description || "-"],
                                            ["Padre", (item) => categories.find((category) => category.categories_id === item.parent_id)?.name ?? "-"],
                                            [
                                                "Acciones",
                                                (item) => (
                                                    <RowActions
                                                        onEdit={() => {
                                                            setSimpleForm({
                                                                ...emptySimple,
                                                                id: item.categories_id,
                                                                name: item.name,
                                                                description: item.description ?? "",
                                                                parent_id: item.parent_id ? String(item.parent_id) : "",
                                                            })
                                                            setModalMode("edit")
                                                        }}
                                                        onDelete={() => deleteResource(`/categories/${item.categories_id}`)}
                                                    />
                                                ),
                                            ],
                                        ]}
                                    />
                                )}

                                {activeTab === "catalogs" && catalogKind === "brands" && (
                                    <DataTable
                                        rows={filteredBrands}
                                        empty="No se encontraron marcas."
                                        columns={[
                                            ["Marca", (item) => item.brand_name],
                                            [
                                                "Acciones",
                                                (item) => (
                                                    <RowActions
                                                        onEdit={() => {
                                                            setSimpleForm({ ...emptySimple, id: item.products_brands_id, brand_name: item.brand_name })
                                                            setModalMode("edit")
                                                        }}
                                                        onDelete={() => deleteResource(`/brands/${item.products_brands_id}`)}
                                                    />
                                                ),
                                            ],
                                        ]}
                                    />
                                )}

                                {activeTab === "warehouses" && (
                                    <DataTable
                                        rows={filteredWarehouses}
                                        empty="No se encontraron almacenes."
                                        columns={[
                                            ["Almacen", (item) => item.name],
                                            ["Ubicacion", (item) => item.location || "-"],
                                            [
                                                "Acciones",
                                                (item) => (
                                                    <RowActions
                                                        onEdit={() => {
                                                            setSimpleForm({
                                                                ...emptySimple,
                                                                id: item.warehouses_id,
                                                                name: item.name,
                                                                location: item.location ?? "",
                                                            })
                                                            setModalMode("edit")
                                                        }}
                                                        onDelete={() => deleteResource(`/warehouses/${item.warehouses_id}`)}
                                                    />
                                                ),
                                            ],
                                        ]}
                                    />
                                )}

                                {activeTab === "users" && (
                                    <DataTable
                                        rows={filteredUsers}
                                        empty="No se encontraron usuarios."
                                        columns={[
                                            ["Usuario", (item) => `${item.name} ${item.last_name}`],
                                            ["Correo", (item) => item.email],
                                            ["Rol", (item) => item.role_name ?? item.roles_id ?? item.role_id ?? "-"],
                                            ["Estatus", (item) => <StatusBadge active={item.active !== false} />],
                                            [
                                                "Acciones",
                                                (item) => (
                                                    <RowActions onToggle={() => toggleStatus(`/users/${item.users_id}/status`)} />
                                                ),
                                            ],
                                        ]}
                                    />
                                )}
                            </>
                        )}
                    </section>
                )}
            </section>

            <AppModal
                isOpen={modalMode !== null}
                title={modalTitle(activeTab, catalogKind, modalMode)}
                onClose={closeModal}
            >
                {modalMode === "movement" && (
                    <MovementFormView
                        form={movementForm}
                        products={products}
                        setForm={setMovementForm}
                        onSave={saveMovement}
                    />
                )}

                {activeTab === "products" && modalMode !== "movement" && (
                    <ProductFormView
                        form={productForm}
                        providers={providers}
                        categories={categories}
                        brands={brands}
                        warehouses={warehouses}
                        setForm={setProductForm}
                        onSave={saveProduct}
                    />
                )}

                {activeTab === "users" && modalMode !== "movement" && (
                    <UserFormView form={userForm} setForm={setUserForm} onSave={saveUser} />
                )}

                {activeTab !== "products" && activeTab !== "users" && activeTab !== "movements" && modalMode !== "movement" && (
                    <SimpleFormView
                        activeTab={activeTab}
                        catalogKind={catalogKind}
                        form={simpleForm}
                        categories={categories}
                        setForm={setSimpleForm}
                        onSave={saveSimpleResource}
                    />
                )}
            </AppModal>
        </main>
    )
}

const HeaderActions = ({
    activeTab,
    catalogKind,
    setCatalogKind,
    onCreate,
    onRefresh,
}: {
    activeTab: Tab
    catalogKind: CatalogKind
    setCatalogKind: (kind: CatalogKind) => void
    onCreate: () => void
    onRefresh: () => void
}) => (
    <div className="toolbar">
        {activeTab === "catalogs" && (
            <div className="segmented">
                <button className={catalogKind === "categories" ? "active" : ""} onClick={() => setCatalogKind("categories")}>
                    Categorias
                </button>
                <button className={catalogKind === "brands" ? "active" : ""} onClick={() => setCatalogKind("brands")}>
                    Marcas
                </button>
            </div>
        )}
        <button className="secondary-button" onClick={onRefresh}>
            <RefreshCcw size={16} />
            Actualizar
        </button>
        <button className="primary-button compact" onClick={onCreate}>
            <Plus size={17} />
            Nuevo
        </button>
    </div>
)

const ProductFormView = ({
    form,
    providers,
    categories,
    brands,
    warehouses,
    setForm,
    onSave,
}: {
    form: ProductForm
    providers: Provider[]
    categories: Category[]
    brands: Brand[]
    warehouses: WarehouseType[]
    setForm: React.Dispatch<React.SetStateAction<ProductForm>>
    onSave: () => void
}) => (
    <div className="form-grid">
        <TextInput label="Nombre" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} />
        <TextInput label="Descripcion" value={form.description} onChange={(description) => setForm((current) => ({ ...current, description }))} />
        <SelectInput label="Proveedor" value={form.providers_id} onChange={(providers_id) => setForm((current) => ({ ...current, providers_id }))} options={providers.map((item) => [item.providers_id, item.name])} />
        <SelectInput label="Categoria" value={form.categories_id} onChange={(categories_id) => setForm((current) => ({ ...current, categories_id }))} options={categories.map((item) => [item.categories_id, item.name])} />
        <SelectInput label="Marca" value={form.products_brands_id} onChange={(products_brands_id) => setForm((current) => ({ ...current, products_brands_id }))} options={brands.map((item) => [item.products_brands_id, item.brand_name])} />
        <SelectInput label="Almacen" value={form.warehouses_id} onChange={(warehouses_id) => setForm((current) => ({ ...current, warehouses_id }))} options={warehouses.map((item) => [item.warehouses_id, item.name])} />
        <TextInput label="Stock" type="number" value={form.stock} onChange={(stock) => setForm((current) => ({ ...current, stock }))} />
        <TextInput label="Minimo" type="number" value={form.min_stock} onChange={(min_stock) => setForm((current) => ({ ...current, min_stock }))} />
        <TextInput label="Precio unitario" type="number" value={form.unit_price} onChange={(unit_price) => setForm((current) => ({ ...current, unit_price }))} />
        <button className="primary-button form-submit" onClick={onSave}>Guardar producto</button>
    </div>
)

const SimpleFormView = ({
    activeTab,
    catalogKind,
    form,
    categories,
    setForm,
    onSave,
}: {
    activeTab: Tab
    catalogKind: CatalogKind
    form: SimpleForm
    categories: Category[]
    setForm: React.Dispatch<React.SetStateAction<SimpleForm>>
    onSave: () => void
}) => {
    if (activeTab === "catalogs" && catalogKind === "brands") {
        return (
            <div className="form-grid">
                <TextInput label="Marca" value={form.brand_name} onChange={(brand_name) => setForm((current) => ({ ...current, brand_name }))} />
                <button className="primary-button form-submit" onClick={onSave}>Guardar marca</button>
            </div>
        )
    }

    return (
        <div className="form-grid">
            <TextInput label="Nombre" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} />
            {activeTab === "warehouses" ? (
                <TextInput label="Ubicacion" value={form.location} onChange={(location) => setForm((current) => ({ ...current, location }))} />
            ) : (
                <TextInput label="Descripcion" value={form.description} onChange={(description) => setForm((current) => ({ ...current, description }))} />
            )}
            {activeTab === "catalogs" && catalogKind === "categories" && (
                <SelectInput label="Categoria padre" value={form.parent_id} onChange={(parent_id) => setForm((current) => ({ ...current, parent_id }))} options={categories.map((item) => [item.categories_id, item.name])} allowEmpty />
            )}
            <button className="primary-button form-submit" onClick={onSave}>Guardar</button>
        </div>
    )
}

const UserFormView = ({
    form,
    setForm,
    onSave,
}: {
    form: UserForm
    setForm: React.Dispatch<React.SetStateAction<UserForm>>
    onSave: () => void
}) => (
    <div className="form-grid">
        <TextInput label="Nombre" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} />
        <TextInput label="Apellidos" value={form.last_name} onChange={(last_name) => setForm((current) => ({ ...current, last_name }))} />
        <TextInput label="Correo" type="email" value={form.email} onChange={(email) => setForm((current) => ({ ...current, email }))} />
        <TextInput label="Contrasena" type="password" value={form.password} onChange={(password) => setForm((current) => ({ ...current, password }))} />
        <SelectInput label="Rol" value={form.roles_id} onChange={(roles_id) => setForm((current) => ({ ...current, roles_id }))} options={[[1, "Usuario"], [2, "Supervisor"], [3, "Administrador"]]} />
        <button className="primary-button form-submit" onClick={onSave}>Crear usuario</button>
    </div>
)

const MovementFormView = ({
    form,
    products,
    setForm,
    onSave,
}: {
    form: MovementForm
    products: Product[]
    setForm: React.Dispatch<React.SetStateAction<MovementForm>>
    onSave: () => void
}) => (
    <div className="form-grid">
        <SelectInput label="Producto" value={form.products_id} onChange={(products_id) => setForm((current) => ({ ...current, products_id }))} options={products.map((item) => [item.products_id, getProductName(item)])} />
        <SelectInput label="Tipo" value={form.movement_type} onChange={(movement_type) => setForm((current) => ({ ...current, movement_type: movement_type as "ENTRY" | "EXIT" }))} options={[["ENTRY", "Entrada"], ["EXIT", "Salida"]]} />
        <TextInput label="Cantidad" type="number" value={form.quantity} onChange={(quantity) => setForm((current) => ({ ...current, quantity }))} />
        <button className="primary-button form-submit" onClick={onSave}>Registrar movimiento</button>
    </div>
)

const SearchBox = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <label className="search-box">
        <Search size={17} />
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Buscar..." />
    </label>
)

const StatCard = ({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string | number; tone?: "warning" }) => (
    <article className={tone === "warning" ? "stat-card warning" : "stat-card"}>
        <div className="stat-icon">
            <Icon size={22} />
        </div>
        <span>{label}</span>
        <strong>{value}</strong>
    </article>
)

const DataTable = <T,>({
    rows,
    columns,
    empty,
}: {
    rows: T[]
    empty: string
    columns: Array<[string, (item: T) => React.ReactNode]>
}) => (
    <div className="table-wrap">
        <table>
            <thead>
                <tr>
                    {columns.map(([label]) => (
                        <th key={label}>{label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        {columns.map(([label, render]) => (
                            <td key={label}>{render(row)}</td>
                        ))}
                    </tr>
                ))}
                {rows.length === 0 && (
                    <tr>
                        <td colSpan={columns.length} className="empty-cell">{empty}</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
)

const RowActions = ({ onEdit, onToggle, onDelete }: { onEdit?: () => void; onToggle?: () => void; onDelete?: () => void }) => (
    <div className="row-actions">
        {onEdit && (
            <button className="icon-button" onClick={onEdit} title="Editar">
                <Pencil size={16} />
            </button>
        )}
        {onToggle && (
            <button className="icon-button" onClick={onToggle} title="Cambiar estatus">
                <RefreshCcw size={16} />
            </button>
        )}
        {onDelete && (
            <button className="icon-button danger" onClick={onDelete} title="Eliminar">
                <Trash2 size={16} />
            </button>
        )}
    </div>
)

const StatusBadge = ({ active }: { active: boolean }) => (
    <span className={active ? "badge success" : "badge muted"}>{active ? "Activo" : "Inactivo"}</span>
)

const StockBadge = ({ product }: { product: Product }) => {
    const isLow = Number(product.stock ?? 0) <= Number(product.min_stock ?? 0)
    return <span className={isLow ? "badge warning" : "badge success"}>{product.stock ?? 0}</span>
}

const MovementBadge = ({ type }: { type: string }) => (
    <span className={type === "ENTRY" ? "badge success" : "badge warning"}>{type === "ENTRY" ? "Entrada" : "Salida"}</span>
)

const TextInput = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) => (
    <label className="field">
        {label}
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
)

const SelectInput = ({
    label,
    value,
    onChange,
    options,
    allowEmpty,
}: {
    label: string
    value: string
    onChange: (value: string) => void
    options: Array<[string | number, string]>
    allowEmpty?: boolean
}) => (
    <label className="field">
        {label}
        <select value={value} onChange={(event) => onChange(event.target.value)}>
            <option value="">{allowEmpty ? "Sin seleccionar" : "Selecciona una opcion"}</option>
            {options.map(([optionValue, optionLabel]) => (
                <option key={String(optionValue)} value={String(optionValue)}>
                    {optionLabel}
                </option>
            ))}
        </select>
    </label>
)

const AppModal = ({ isOpen, title, children, onClose }: { isOpen: boolean; title: string; children: React.ReactNode; onClose: () => void }) => {
    if (!isOpen) return null

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <section className="modal" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="icon-button" onClick={onClose}>x</button>
                </div>
                {children}
            </section>
        </div>
    )
}

const modalTitle = (activeTab: Tab, catalogKind: CatalogKind, modalMode: ModalMode) => {
    if (modalMode === "movement") return "Registrar movimiento"
    if (activeTab === "products") return modalMode === "edit" ? "Editar producto" : "Nuevo producto"
    if (activeTab === "providers") return modalMode === "edit" ? "Editar proveedor" : "Nuevo proveedor"
    if (activeTab === "warehouses") return modalMode === "edit" ? "Editar almacen" : "Nuevo almacen"
    if (activeTab === "users") return "Nuevo usuario"
    return catalogKind === "brands" ? "Marca" : "Categoria"
}

const formatDate = (date?: string) => {
    if (!date) return "-"
    return new Date(date).toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
    })
}

export default MainPage
