import { useState } from "react"
import { DataTable, RowActions, StatusBadge, StockBadge } from "../../components/common"
import { SectionPanel } from "../../components/sectionPanel"
import { useDashboard } from "../../context"
import { currentUserRole } from "../../../../shared/api/client"
import { getProductName, money } from "../../utils"
import type { ReactNode } from "react"
import type { Product } from "../../../../shared/types/inventory"

const ProductsPage = () => {
    const { query, setQuery, isLoading, catalogKind, setCatalogKind, products, loadData, openProductModal, toggleStatus } = useDashboard()
    const isAdmin = currentUserRole() === 1
    const normalizedQuery = query.toLowerCase()
    const [categoryFilter, setCategoryFilter] = useState("")

    const sortedProducts = [...products].sort((a, b) =>
        getProductName(a).localeCompare(getProductName(b), "es", { sensitivity: "base" })
    )

    const uniqueCategories = [...new Set(products.map((p) => p.category_name).filter(Boolean))] as string[]

    const filteredProducts = sortedProducts.filter((product) => {
        const text = `${getProductName(product)} ${product.description ?? ""} ${product.provider_name ?? ""} ${product.category_name ?? ""} ${product.brand_name ?? ""} ${product.warehouse_name ?? ""}`.toLowerCase()
        const matchesText = text.includes(normalizedQuery)
        const matchesCategory = !categoryFilter || product.category_name === categoryFilter
        return matchesText && matchesCategory
    })

    const outOfStock = products.filter((p) => Number(p.stock ?? 0) === 0 && p.active !== false)
    const lowStock = products.filter((p) => {
        const s = Number(p.stock ?? 0)
        const m = Number(p.min_stock ?? 0)
        return s > 0 && s <= m && p.active !== false
    })

    const columns: Array<[string, (item: Product) => ReactNode]> = [
        ["Producto", (item) => getProductName(item)],
        ["Descripción", (item) => item.description ?? "-"],
        ["Categoría", (item) => item.category_name ?? "-"],
        ["Marca", (item) => item.brand_name ?? "-"],
        ["Almacén", (item) => item.warehouse_name ?? "-"],
        ["Stock actual", (item) => <StockBadge product={item} />],
        ["Stock mínimo", (item) => item.min_stock ?? "-"],
        ["Precio", (item) => money.format(Number(item.unit_price ?? 0))],
        ["Estatus", (item) => <StatusBadge active={item.active !== false} />],
    ]

    if (isAdmin) {
        columns.push(["Acciones", (item) => (
            <RowActions
                onEdit={() => openProductModal(item)}
                onToggle={() => toggleStatus(`/products/${item.products_id}/status`)}
            />
        )])
    }

    return (
        <SectionPanel activeTab="products" catalogKind={catalogKind} setCatalogKind={setCatalogKind} query={query} setQuery={setQuery} isLoading={isLoading} onCreate={isAdmin ? () => openProductModal() : undefined} onRefresh={loadData}>
            {outOfStock.length > 0 && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 16px", marginBottom: "12px", fontSize: "0.875rem", color: "#dc2626", fontWeight: 500 }}>
                    ⚠ {outOfStock.length} producto{outOfStock.length > 1 ? "s" : ""} agotado{outOfStock.length > 1 ? "s" : ""}: {outOfStock.map((p) => getProductName(p)).join(", ")}
                </div>
            )}
            {lowStock.length > 0 && (
                <div style={{ background: "#fff4d7", border: "1px solid #fcd34d", borderRadius: "8px", padding: "10px 16px", marginBottom: "12px", fontSize: "0.875rem", color: "#92400e", fontWeight: 500 }}>
                    ⚡ {lowStock.length} producto{lowStock.length > 1 ? "s" : ""} bajo el mínimo: {lowStock.map((p) => getProductName(p)).join(", ")}
                </div>
            )}
            <div style={{ marginBottom: "12px" }}>
                <label className="field" style={{ maxWidth: "260px", margin: 0 }}>
                    Filtrar por categoría
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="">Todas las categorías</option>
                        {uniqueCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </label>
            </div>
            <DataTable rows={filteredProducts} empty="No se encontraron productos con los criterios seleccionados." columns={columns} />
        </SectionPanel>
    )
}

export default ProductsPage
