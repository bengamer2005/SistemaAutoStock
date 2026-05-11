import type { Dispatch, SetStateAction } from "react"
import type { Brand, Category, Product, Provider, Warehouse as WarehouseType } from "../../../shared/types/inventory"
import type { CatalogKind, MovementForm, ProductForm, SimpleForm, Tab, UserForm } from "../types"
import { getProductName } from "../utils"
import { SelectInput, TextInput } from "./common"

export const ProductFormView = ({
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
    setForm: Dispatch<SetStateAction<ProductForm>>
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

export const SimpleFormView = ({
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
    setForm: Dispatch<SetStateAction<SimpleForm>>
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

export const UserFormView = ({
    form,
    setForm,
    onSave,
}: {
    form: UserForm
    setForm: Dispatch<SetStateAction<UserForm>>
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

export const MovementFormView = ({
    form,
    products,
    setForm,
    onSave,
}: {
    form: MovementForm
    products: Product[]
    setForm: Dispatch<SetStateAction<MovementForm>>
    onSave: () => void
}) => (
    <div className="form-grid">
        <SelectInput label="Producto" value={form.products_id} onChange={(products_id) => setForm((current) => ({ ...current, products_id }))} options={products.map((item) => [item.products_id, getProductName(item)])} />
        <SelectInput label="Tipo" value={form.movement_type} onChange={(movement_type) => setForm((current) => ({ ...current, movement_type: movement_type as "ENTRY" | "EXIT" }))} options={[["ENTRY", "Entrada"], ["EXIT", "Salida"]]} />
        <TextInput label="Cantidad" type="number" value={form.quantity} onChange={(quantity) => setForm((current) => ({ ...current, quantity }))} />
        <button className="primary-button form-submit" onClick={onSave}>Registrar movimiento</button>
    </div>
)
