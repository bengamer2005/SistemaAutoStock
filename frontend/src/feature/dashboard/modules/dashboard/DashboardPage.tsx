import { AlertTriangle, Building2, Package, RefreshCcw, TrendingDown, TrendingUp } from "lucide-react"
import { DataTable, StatCard } from "../../components/common"
import { useDashboard } from "../../context"
import { getProductName, money } from "../../utils"

const DashboardPage = () => {
    const { products, warehouses, movements, loadData } = useDashboard()

    const lowStockProducts = products.filter((p) => p.min_stock != null && Number(p.stock ?? 0) <= Number(p.min_stock))
    const activeProducts = products.filter((p) => p.active !== false)
    const inventoryValue = products.reduce((total, p) => total + Number(p.stock ?? 0) * Number(p.unit_price ?? 0), 0)

    const outOfStockProducts = products.filter((p) => Number(p.stock ?? 0) === 0 && p.active !== false)

    const today = new Date().toDateString()
    const todayMovements = movements.filter((m) => m.created_at && new Date(m.created_at).toDateString() === today)

    const countById: Record<number, number> = {}
    movements.forEach((m) => { countById[m.products_id] = (countById[m.products_id] ?? 0) + 1 })
    const top5 = Object.entries(countById)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, count]) => {
            const product = products.find((p) => p.products_id === Number(id))
            return { name: product ? getProductName(product) : `Producto ${id}`, count }
        })

    const warehouseDist: Record<string, number> = {}
    products.forEach((p) => {
        const wh = p.warehouse_name ?? "Sin almacen"
        warehouseDist[wh] = (warehouseDist[wh] ?? 0) + 1
    })
    const warehouseRows = Object.entries(warehouseDist).map(([name, count]) => ({ name, count }))

    return (
        <section className="content-grid">
            <StatCard icon={Package} label="Productos activos" value={activeProducts.length} />
            <StatCard icon={TrendingDown} label="Bajo mínimo" value={lowStockProducts.length} tone="warning" />
            <StatCard icon={AlertTriangle} label="Agotados" value={outOfStockProducts.length} tone="warning" />
            <StatCard icon={Building2} label="Almacenes" value={warehouses.length} />
            <StatCard icon={TrendingUp} label="Valor inventario" value={money.format(inventoryValue)} />
            <StatCard icon={RefreshCcw} label="Movimientos hoy" value={todayMovements.length} />

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
                        ["Mínimo", (item) => item.min_stock ?? 0],
                        ["Proveedor", (item) => item.provider_name ?? "-"],
                    ]}
                />
            </div>

            <div className="panel wide">
                <div className="panel-header">
                    <div>
                        <h2>Productos agotados</h2>
                        <p>Productos con stock en cero que requieren reabastecimiento urgente.</p>
                    </div>
                </div>
                <DataTable
                    rows={outOfStockProducts}
                    empty="No hay productos agotados."
                    columns={[
                        ["Producto", (item) => getProductName(item)],
                        ["Categoría", (item) => item.category_name ?? "-"],
                        ["Proveedor", (item) => item.provider_name ?? "-"],
                        ["Almacén", (item) => item.warehouse_name ?? "-"],
                        ["Stock mínimo", (item) => item.min_stock ?? 0],
                    ]}
                />
            </div>

            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Productos con más movimientos</h2>
                        <p>Productos con mayor actividad en el inventario.</p>
                    </div>
                </div>
                <DataTable
                    rows={top5}
                    empty="Sin movimientos registrados."
                    columns={[
                        ["Producto", (item) => item.name],
                        ["Movimientos", (item) => item.count],
                    ]}
                />
            </div>

            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Distribución por almacen</h2>
                        <p>Cantidad de productos en cada almacen.</p>
                    </div>
                </div>
                <DataTable
                    rows={warehouseRows}
                    empty="Sin almacenes registrados."
                    columns={[
                        ["Almacén", (item) => item.name],
                        ["Productos", (item) => item.count],
                    ]}
                />
            </div>
        </section>
    )
}

export default DashboardPage
