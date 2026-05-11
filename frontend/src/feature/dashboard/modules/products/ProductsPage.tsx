import { DataTable, RowActions, StatusBadge, StockBadge } from "../../components/common"
import { SectionPanel } from "../../components/sectionPanel"
import { useDashboard } from "../../context"
import { getProductName, money } from "../../utils"

const ProductsPage = () => {
    const { query, setQuery, isLoading, catalogKind, setCatalogKind, products, loadData, openProductModal, toggleStatus } = useDashboard()
    const normalizedQuery = query.toLowerCase()
    const filteredProducts = products.filter((product) => {
        const text = `${getProductName(product)} ${product.description ?? ""} ${product.provider_name ?? ""} ${product.category_name ?? ""}`.toLowerCase()
        return text.includes(normalizedQuery)
    })

    return (
        <SectionPanel activeTab="products" catalogKind={catalogKind} setCatalogKind={setCatalogKind} query={query} setQuery={setQuery} isLoading={isLoading} onCreate={() => openProductModal()} onRefresh={loadData}>
            <DataTable
                rows={filteredProducts}
                empty="No se encontraron productos."
                columns={[
                    ["Producto", (item) => getProductName(item)],
                    ["Stock", (item) => <StockBadge product={item} />],
                    ["Precio", (item) => money.format(Number(item.unit_price ?? 0))],
                    ["Proveedor", (item) => item.provider_name ?? "-"],
                    ["Estatus", (item) => <StatusBadge active={item.active !== false} />],
                    ["Acciones", (item) => <RowActions onEdit={() => openProductModal(item)} onToggle={() => toggleStatus(`/products/${item.products_id}/status`)} />],
                ]}
            />
        </SectionPanel>
    )
}

export default ProductsPage
