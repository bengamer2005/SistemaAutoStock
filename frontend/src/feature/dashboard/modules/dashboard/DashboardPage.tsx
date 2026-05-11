import { Building2, Package, RefreshCcw, TrendingDown, TrendingUp } from "lucide-react"
import { DataTable, StatCard } from "../../components/common"
import { useDashboard } from "../../context"
import { getProductName, money } from "../../utils"

const DashboardPage = () => {
    const { products, warehouses, loadData } = useDashboard()
    const lowStockProducts = products.filter((product) => Number(product.stock ?? 0) <= Number(product.min_stock ?? 0))
    const activeProducts = products.filter((product) => product.active !== false)
    const inventoryValue = products.reduce((total, product) => {
        return total + Number(product.stock ?? 0) * Number(product.unit_price ?? 0)
    }, 0)

    return (
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
    )
}

export default DashboardPage
