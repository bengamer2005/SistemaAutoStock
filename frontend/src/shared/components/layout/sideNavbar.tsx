import { Home, Package, Users, BarChart3, Barcode } from "lucide-react"

interface SideNavbarProps {
    activeTab: "dashboard" | "orders" | "clients" | "reports" | "products",
    onTabChange: (tab: "dashboard" | "orders" | "clients" | "reports" | "products") => void
}

const SideNavbar: React.FC<SideNavbarProps> = ({ activeTab, onTabChange }) => {
    const userData = localStorage.getItem("user")
    const user = userData ? JSON.parse(userData) : null

    const navItems = [
        { id: "dashboard" as const, label: "Dashboard", icon: Home },
        { id: "orders" as const, label: "Pedidos", icon: Package },
        { id: "products" as const, label: "Productos", icon: Barcode },
        { id: "clients" as const, label: "Clientes", icon: Users },
        { id: "reports" as const, label: "Reportes", icon: BarChart3 },
    ]

    const filteredNavItems = navItems.filter(item => {
        if (item.id === "reports" && user?.role_id !== 3) {
            return false
        }
        return true
    })
    
    return (
        <>
            <aside className="fixed left-0 top-0 bottom-0 w-[60px] bg-[#1A202C] flex flex-col items-center py-6 z-50">
                {/* logo */}
                <div className="w-9 h-9 bg-[#78A890] rounded-[10px] flex items-center justify-center text-white font-extrabold text-lg mb-8">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="29"
                        height="29"
                        viewBox="0 0 25 25"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-package-cog"
                    >
                        <path d="M11 21.73a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                        <path d="M12 22V12"/>
                        <polyline points="3.29 7 12 12 20.71 7"/>
                        <path d="M7.5 4.27 16.5 9.42"/>

                        <circle cx="18" cy="18" r="3" stroke="#454d57" strokeWidth="2"/>
                        <path d="M18 14.5v-2" stroke="#454d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18 21.5v2" stroke="#454d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.5 18h-2" stroke="#454d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21.5 18h2" stroke="#454d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15.6 15.6l-1.4-1.4" stroke="#454d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.1 20.1l 1.4 1.4" stroke="#454d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15.6 20.4l-1.4 1.4" stroke="#454d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.1 15.9l 1.4-1.4" stroke="#454d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* nav icons */}
                <nav className="flex flex-col gap-6 flex-1">
                    {filteredNavItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id

                        return (
                            <button key={item.id} onClick={() => onTabChange(item.id)} title={item.label} className={`w-10 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 relative group
                                ${isActive ? "bg-[#78A890] text-white" : "text-[#718096] hover:bg-[#78A890]/10 hover:text-[#78A890]"
                            }`}>
                                <Icon className="w-5 h-5"/>

                                {isActive && (
                                    <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C0D890] rounded-r"></div>
                                )}

                                <span className="absolute left-[60px] ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}

export default SideNavbar