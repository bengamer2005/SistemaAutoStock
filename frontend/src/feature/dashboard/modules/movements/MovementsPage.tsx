import { DataTable, MovementBadge } from "../../components/common"
import { SectionPanel } from "../../components/sectionPanel"
import { useDashboard } from "../../context"
import { currentUserRole } from "../../../../shared/api/client"
import { formatDate, getMovementProduct } from "../../utils"

const MovementsPage = () => {
    const { query, setQuery, isLoading, catalogKind, setCatalogKind, movements, loadData, setModalMode } = useDashboard()
    const canCreateMovement = currentUserRole() === 2
    const normalizedQuery = query.toLowerCase()
    const filteredMovements = movements.filter((movement) => `${getMovementProduct(movement)} ${movement.movement_type}`.toLowerCase().includes(normalizedQuery))

    return (
        <SectionPanel activeTab="movements" catalogKind={catalogKind} setCatalogKind={setCatalogKind} query={query} setQuery={setQuery} isLoading={isLoading} onCreate={canCreateMovement ? () => setModalMode("movement") : undefined} onRefresh={loadData}>
            <DataTable
                rows={filteredMovements}
                empty="No se encontraron movimientos."
                columns={[
                    ["Producto", (item) => getMovementProduct(item)],
                    ["Tipo", (item) => <MovementBadge type={item.movement_type} />],
                    ["Cantidad", (item) => item.quantity],
                    ["Registrado por", (item) => item.created_by_name ?? "-"],
                    ["Fecha", (item) => formatDate(item.created_at)],
                ]}
            />
        </SectionPanel>
    )
}

export default MovementsPage
