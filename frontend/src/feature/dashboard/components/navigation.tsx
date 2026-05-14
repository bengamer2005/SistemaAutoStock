import type { ElementType } from "react"
import { NavLink } from "react-router"
import { Archive, Boxes, ClipboardList, Factory, Layers3, LogOut, Package, RefreshCcw, ShieldCheck, Users, Warehouse } from "lucide-react"
import type { UserRecord } from "../../../shared/types/inventory"
import type { Tab } from "../types"

export const navItems: Array<{ id: Tab; label: string; icon: ElementType; path: string; maxRole?: number }> = [
    { id: "dashboard", label: "Panel", icon: Archive, path: "/main/dashboard", maxRole: 1 },
    { id: "products", label: "Productos", icon: Package, path: "/main/products" },
    { id: "movements", label: "Movimientos", icon: RefreshCcw, path: "/main/movements", maxRole: 2 },
    { id: "providers", label: "Proveedores", icon: Factory, path: "/main/providers", maxRole: 1 },
    { id: "catalogs", label: "Catalogos", icon: Layers3, path: "/main/catalogs", maxRole: 1 },
    { id: "warehouses", label: "Almacenes", icon: Warehouse, path: "/main/warehouses", maxRole: 1 },
    { id: "users", label: "Usuarios", icon: Users, path: "/main/users", maxRole: 1 },
    { id: "reports", label: "Reporte", icon: ClipboardList, path: "/main/reports" },
]

export const DashboardSidebar = ({
    onLogout,
}: {
    onLogout: () => void
}) => {
    const stored = localStorage.getItem("user")
    const userRole: number = stored ? (JSON.parse(stored)?.roles_id ?? 99) : 99
    const visibleItems = navItems.filter(item => item.maxRole === undefined || userRole <= item.maxRole)

    return (
    <aside className="sidebar">
        <div className="sidebar-brand">
            <Boxes size={28} />
            <span>AutoStock</span>
        </div>

        <nav>
            {visibleItems.map((item) => {
                const Icon = item.icon
                return (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                    >
                        <Icon size={19} />
                        {item.label}
                    </NavLink>
                )
            })}
        </nav>

        <button className="nav-item logout" onClick={onLogout}>
            <LogOut size={19} />
            Salir
        </button>
    </aside>
    )
}

export const DashboardTopbar = ({ activeTab, user }: { activeTab: Tab; user: UserRecord | null }) => (
    <header className="topbar">
        <div>
            <span className="eyebrow">SistemaAutoStock</span>
            <h1>{navItems.find((item) => item.id === activeTab)?.label}</h1>
        </div>

        <div className="user-pill">
            <ShieldCheck size={18} />
            <span>{user ? `${user.name} ${user.last_name}` : "Usuario"}</span>
        </div>
    </header>
)
