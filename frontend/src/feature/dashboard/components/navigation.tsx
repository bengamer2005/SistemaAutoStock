import type { ElementType } from "react"
import { NavLink } from "react-router"
import { Archive, Boxes, Factory, Layers3, LogOut, Package, RefreshCcw, ShieldCheck, Users, Warehouse } from "lucide-react"
import type { UserRecord } from "../../../shared/types/inventory"
import type { Tab } from "../types"

export const navItems: Array<{ id: Tab; label: string; icon: ElementType; path: string }> = [
    { id: "dashboard", label: "Panel", icon: Archive, path: "/main/dashboard" },
    { id: "products", label: "Productos", icon: Package, path: "/main/products" },
    { id: "movements", label: "Movimientos", icon: RefreshCcw, path: "/main/movements" },
    { id: "providers", label: "Proveedores", icon: Factory, path: "/main/providers" },
    { id: "catalogs", label: "Catalogos", icon: Layers3, path: "/main/catalogs" },
    { id: "warehouses", label: "Almacenes", icon: Warehouse, path: "/main/warehouses" },
    { id: "users", label: "Usuarios", icon: Users, path: "/main/users" },
]

export const DashboardSidebar = ({
    onLogout,
}: {
    onLogout: () => void
}) => (
    <aside className="sidebar">
        <div className="sidebar-brand">
            <Boxes size={28} />
            <span>AutoStock</span>
        </div>

        <nav>
            {navItems.map((item) => {
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
