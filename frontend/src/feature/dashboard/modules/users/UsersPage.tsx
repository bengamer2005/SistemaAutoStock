import { DataTable, RowActions, StatusBadge } from "../../components/common"
import { SectionPanel } from "../../components/sectionPanel"
import { useDashboard } from "../../context"

const UsersPage = () => {
    const { query, setQuery, isLoading, catalogKind, setCatalogKind, users, loadData, setModalMode, toggleStatus } = useDashboard()
    const normalizedQuery = query.toLowerCase()
    const filteredUsers = users.filter((item) => `${item.name} ${item.last_name} ${item.email} ${item.role_name ?? ""}`.toLowerCase().includes(normalizedQuery))

    return (
        <SectionPanel activeTab="users" catalogKind={catalogKind} setCatalogKind={setCatalogKind} query={query} setQuery={setQuery} isLoading={isLoading} onCreate={() => setModalMode("create")} onRefresh={loadData}>
            <DataTable
                rows={filteredUsers}
                empty="No se encontraron usuarios."
                columns={[
                    ["Usuario", (item) => `${item.name} ${item.last_name}`],
                    ["Correo", (item) => item.email],
                    ["Rol", (item) => item.role_name ?? item.roles_id ?? item.role_id ?? "-"],
                    ["Estatus", (item) => <StatusBadge active={item.active !== false} />],
                    ["Acciones", (item) => <RowActions onToggle={() => toggleStatus(`/users/${item.users_id}/status`, "PUT")} />],
                ]}
            />
        </SectionPanel>
    )
}

export default UsersPage
