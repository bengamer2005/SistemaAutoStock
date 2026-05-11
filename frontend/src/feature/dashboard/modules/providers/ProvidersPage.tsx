import { DataTable, RowActions, StatusBadge } from "../../components/common"
import { SectionPanel } from "../../components/sectionPanel"
import { useDashboard } from "../../context"
import { emptySimple } from "../../types"

const ProvidersPage = () => {
    const { query, setQuery, isLoading, catalogKind, setCatalogKind, providers, loadData, openSimpleModal, setModalMode, toggleStatus } = useDashboard()
    const normalizedQuery = query.toLowerCase()
    const filteredProviders = providers.filter((provider) => `${provider.name} ${provider.description ?? ""}`.toLowerCase().includes(normalizedQuery))

    return (
        <SectionPanel activeTab="providers" catalogKind={catalogKind} setCatalogKind={setCatalogKind} query={query} setQuery={setQuery} isLoading={isLoading} onCreate={() => setModalMode("create")} onRefresh={loadData}>
            <DataTable
                rows={filteredProviders}
                empty="No se encontraron proveedores."
                columns={[
                    ["Proveedor", (item) => item.name],
                    ["Descripcion", (item) => item.description || "-"],
                    ["Estatus", (item) => <StatusBadge active={item.active !== false} />],
                    [
                        "Acciones",
                        (item) => (
                            <RowActions
                                onEdit={() => openSimpleModal({ ...emptySimple, id: item.providers_id, name: item.name, description: item.description ?? "" })}
                                onToggle={() => toggleStatus(`/providers/${item.providers_id}/status`)}
                            />
                        ),
                    ],
                ]}
            />
        </SectionPanel>
    )
}

export default ProvidersPage
