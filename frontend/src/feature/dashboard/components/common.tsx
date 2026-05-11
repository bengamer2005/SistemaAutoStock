import type { ElementType, ReactNode } from "react"
import { Pencil, Plus, RefreshCcw, Search, Trash2 } from "lucide-react"
import type { Product } from "../../../shared/types/inventory"
import type { CatalogKind, Tab } from "../types"

export const HeaderActions = ({
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

export const SearchBox = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <label className="search-box">
        <Search size={17} />
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Buscar..." />
    </label>
)

export const StatCard = ({
    icon: Icon,
    label,
    value,
    tone,
}: {
    icon: ElementType
    label: string
    value: string | number
    tone?: "warning"
}) => (
    <article className={tone === "warning" ? "stat-card warning" : "stat-card"}>
        <div className="stat-icon">
            <Icon size={22} />
        </div>
        <span>{label}</span>
        <strong>{value}</strong>
    </article>
)

export const DataTable = <T,>({
    rows,
    columns,
    empty,
}: {
    rows: T[]
    empty: string
    columns: Array<[string, (item: T) => ReactNode]>
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

export const RowActions = ({ onEdit, onToggle, onDelete }: { onEdit?: () => void; onToggle?: () => void; onDelete?: () => void }) => (
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

export const StatusBadge = ({ active }: { active: boolean }) => (
    <span className={active ? "badge success" : "badge muted"}>{active ? "Activo" : "Inactivo"}</span>
)

export const StockBadge = ({ product }: { product: Product }) => {
    const isLow = Number(product.stock ?? 0) <= Number(product.min_stock ?? 0)
    return <span className={isLow ? "badge warning" : "badge success"}>{product.stock ?? 0}</span>
}

export const MovementBadge = ({ type }: { type: string }) => (
    <span className={type === "ENTRY" ? "badge success" : "badge warning"}>{type === "ENTRY" ? "Entrada" : "Salida"}</span>
)

export const TextInput = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) => (
    <label className="field">
        {label}
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
)

export const SelectInput = ({
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

export const AppModal = ({ isOpen, title, children, onClose }: { isOpen: boolean; title: string; children: ReactNode; onClose: () => void }) => {
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
