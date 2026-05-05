import { ChevronDown, LogOut, User, Settings } from "lucide-react"
import { useNavigate } from "react-router"
import { useState, useRef, useEffect } from "react"

interface HeaderProps {
    pageTitle: string,
    username?: string,
    userInitials?: string
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
    const [showUserMenu, setShowUserMenu] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const userData = localStorage.getItem("user") || "Usuario"
    const username = JSON.parse(userData).name + " " + JSON.parse(userData).last_name || "Usuario"
    const userInitials = username.split(" ").map(name => name[0]).join("").toUpperCase().slice(0, 2)

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserMenu(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = () => {
        setShowUserMenu(false)

        const logout = () => {
            localStorage.clear()
        }
        logout()
        navigate("/")
    }
    
    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="px-8 py-4 flex justify-between items-center">
                {/* left */}
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-semibold text-[#1A202C]">
                        Sistema GDP <span className="text-gray-500">/ {pageTitle}</span>
                    </h1>
                </div>

                {/* rigth */}
                <div className="flex items-center gap-4">
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F7FAFC] transition-all duration-200">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#78A890] to-[#606078] rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                {userInitials}
                            </div>
                            <ChevronDown className="w-4 h-4 text-[#718096]" />
                        </button>

                        {/* dropdown menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-slideDown">
                                {/* user info */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{username}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <span className="text-sm text-gray-700 font-medium">
                                            Mi Perfil
                                        </span>
                                    </button>

                                    <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Settings className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <span className="text-sm text-gray-700 font-medium">
                                            Configuración
                                        </span>
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className="border-t border-gray-100 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
                                    >
                                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                                            <LogOut className="w-4 h-4 text-red-600" />
                                        </div>
                                        <span className="text-sm font-medium">
                                            Cerrar Sesión
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
            `}</style>
        </header>
    )
}

export default Header