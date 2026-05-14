import { useState } from "react"
import { DataTable } from "../../components/common"
import { SectionPanel } from "../../components/sectionPanel"
import { useDashboard } from "../../context"
import { getProductName } from "../../utils"

const ReportsPage = () => {
    const { query, setQuery, isLoading, catalogKind, setCatalogKind, products, loadData } = useDashboard()
    const normalizedQuery = query.toLowerCase()
    const [categoryFilter, setCategoryFilter] = useState("")

    const uniqueCategories = [...new Set(products.map((p) => p.category_name).filter(Boolean))] as string[]

    const sortedProducts = [...products].sort((a, b) =>
        getProductName(a).localeCompare(getProductName(b), "es", { sensitivity: "base" })
    )

    const filteredProducts = sortedProducts.filter((p) => {
        const matchesText = `${getProductName(p)} ${p.category_name ?? ""} ${p.brand_name ?? ""} ${p.warehouse_name ?? ""}`.toLowerCase().includes(normalizedQuery)
        const matchesCategory = !categoryFilter || p.category_name === categoryFilter
        return matchesText && matchesCategory
    })

    return (
        <SectionPanel activeTab="reports" catalogKind={catalogKind} setCatalogKind={setCatalogKind} query={query} setQuery={setQuery} isLoading={isLoading} onRefresh={loadData}>
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
            <DataTable
                rows={filteredProducts}
                empty="No se encontraron productos con los criterios seleccionados."
                columns={[
                    ["Producto", (item) => getProductName(item)],
                    ["Categoría", (item) => item.category_name ?? "-"],
                    ["Marca", (item) => item.brand_name ?? "-"],
                    ["Almacén", (item) => item.warehouse_name ?? "-"],
                    ["Stock actual", (item) => item.stock ?? 0],
                    ["Stock mínimo", (item) => item.min_stock ?? "-"],
                    ["Estado", (item) => {
                        const stock = Number(item.stock ?? 0)
                        const minStock = Number(item.min_stock ?? 0)
                        const isLow = item.min_stock != null && stock <= minStock
                        return <span className={isLow ? "badge warning" : "badge success"}>{isLow ? "Stock Bajo" : "Normal"}</span>
                    }],
                ]}
            />
        </SectionPanel>
    )
}

export default ReportsPage
