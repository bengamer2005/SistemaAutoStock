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
                <TextInput label="Ubicación" value={form.location} onChange={(location) => setForm((current) => ({ ...current, location }))} />
            ) : (
                <TextInput label="Descripción" value={form.description} onChange={(description) => setForm((current) => ({ ...current, description }))} />
            )}
            {activeTab === "catalogs" && catalogKind === "categories" && (
                <SelectInput label="Es subcategoría de" value={form.parent_id} onChange={(parent_id) => setForm((current) => ({ ...current, parent_id }))}
                options={categories.map((item) => [item.categories_id, item.name])} allowEmpty />
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
}) => {
    const isEdit = !!form.users_id
    return (
        <div className="form-grid">
            <TextInput label="Nombre" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} />
            <TextInput label="Apellidos" value={form.last_name} onChange={(last_name) => setForm((current) => ({ ...current, last_name }))} />
            <TextInput label="Correo" type="email" value={form.email} onChange={(email) => setForm((current) => ({ ...current, email }))} disabled={isEdit} />
            <TextInput label={isEdit ? "Nueva contraseña (opcional)" : "Contraseña"} type="password" value={form.password} onChange={(password) => setForm((current) => ({ ...current, password }))} />
            <SelectInput label="Rol" value={form.roles_id} onChange={(roles_id) => setForm((current) => ({ ...current, roles_id }))} options={[[1, "Administrador"], [2, "Operador"], [3, "Consulta"]]} />
            <button className="primary-button form-submit" onClick={onSave}>{isEdit ? "Guardar cambios" : "Crear usuario"}</button>
        </div>
    )
}

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
}) => {
    const isExit = form.movement_type === "EXIT"
    const availableProducts = isExit
        ? products.filter((p) => Number(p.stock ?? 0) > 0)
        : products.filter((p) => p.active !== false)

    const selectedProduct = products.find((p) => String(p.products_id) === form.products_id)
    const maxStock = Number(selectedProduct?.stock ?? 0)
    const quantity = Number(form.quantity)
    const quantityInvalid = quantity < 1
    const stockInsufficient = isExit && !!form.products_id && quantity > maxStock
    const canSubmit = !!form.products_id && !quantityInvalid && !stockInsufficient

    return (
        <div className="form-grid">
            <SelectInput
                label="Tipo de movimiento"
                value={form.movement_type}
                onChange={(movement_type) => setForm((current) => ({ ...current, movement_type: movement_type as "ENTRY" | "EXIT", products_id: "", quantity: "1" }))}
                options={[["ENTRY", "Entrada — agregar stock"], ["EXIT", "Salida — reducir stock"]]}
            />

            <SelectInput
                label={isExit ? "Producto (solo muestra productos con stock)" : "Producto"}
                value={form.products_id}
                onChange={(products_id) => setForm((current) => ({ ...current, products_id, quantity: "1" }))}
                options={availableProducts.map((item) => [item.products_id, `${getProductName(item)} (${item.stock ?? 0} disponibles)`])}
            />

            {selectedProduct && (
                <>
                    <div style={{ background: isExit ? (stockInsufficient ? "#fef3f2" : "#f0fdf4") : "#f0f9ff", border: `1px solid ${isExit ? (stockInsufficient ? "#fca5a5" : "#86efac") : "#7dd3fc"}`, borderRadius: "8px", padding: "10px 14px", fontSize: "0.875rem" }}>
                        <strong>{getProductName(selectedProduct)}</strong>
                        <br />
                        Stock actual: <strong>{maxStock} unidades</strong>
                        {isExit && <> — puedes sacar hasta <strong>{maxStock}</strong></>}
                    </div>

                    <div>
                        <label className="field">
                            Cantidad a {isExit ? "retirar" : "agregar"}
                            <input
                                type="number"
                                min={1}
                                max={isExit ? maxStock : undefined}
                                value={form.quantity}
                                onChange={(e) => setForm((current) => ({ ...current, quantity: e.target.value }))}
                                style={{ borderColor: stockInsufficient ? "#f87171" : undefined }}
                            />
                        </label>
                        {stockInsufficient && (
                            <p style={{ color: "#dc2626", fontSize: "0.82rem", margin: "4px 0 0", fontWeight: 500 }}>
                                ⚠ No puedes retirar {quantity} — solo hay {maxStock} unidades en stock.
                            </p>
                        )}
                        {quantityInvalid && !stockInsufficient && (
                            <p style={{ color: "#dc2626", fontSize: "0.82rem", margin: "4px 0 0" }}>
                                La cantidad debe ser al menos 1.
                            </p>
                        )}
                    </div>
                </>
            )}

            {isExit && !form.products_id && availableProducts.length === 0 && (
                <p style={{ color: "#dc2626", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>
                    ⚠ No hay productos con stock disponible para realizar una salida.
                </p>
            )}

            <button
                className="primary-button form-submit"
                onClick={onSave}
                disabled={!canSubmit}
                style={{ opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? "pointer" : "not-allowed" }}
            >
                {canSubmit ? "Registrar movimiento" : stockInsufficient ? "Stock insuficiente" : !form.products_id ? "Selecciona un producto" : "Cantidad inválida"}
            </button>
        </div>
    )
}
