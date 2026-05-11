import { DataTable, RowActions } from "../../components/common"
import { SectionPanel } from "../../components/sectionPanel"
import { useDashboard } from "../../context"
import { emptySimple } from "../../types"

const WarehousesPage = () => {
    const { query, setQuery, isLoading, catalogKind, setCatalogKind, warehouses, loadData, openSimpleModal, setModalMode, deleteResource } = useDashboard()
    const normalizedQuery = query.toLowerCase()
    const filteredWarehouses = warehouses.filter((warehouse) => `${warehouse.name} ${warehouse.location ?? ""}`.toLowerCase().includes(normalizedQuery))

    return (
        <SectionPanel activeTab="warehouses" catalogKind={catalogKind} setCatalogKind={setCatalogKind} query={query} setQuery={setQuery} isLoading={isLoading} onCreate={() => setModalMode("create")} onRefresh={loadData}>
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
                                onEdit={() => openSimpleModal({ ...emptySimple, id: item.warehouses_id, name: item.name, location: item.location ?? "" })}
                                onDelete={() => deleteResource(`/warehouses/${item.warehouses_id}`)}
                            />
                        ),
                    ],
                ]}
            />
        </SectionPanel>
    )
}

export default WarehousesPage
