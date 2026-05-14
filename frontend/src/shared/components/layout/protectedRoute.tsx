import { Navigate, Outlet, useLocation } from "react-router"
import { ShieldX } from "lucide-react"

interface Props {
    allowedRoles?: number[]
}

const AccessDenied = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px", color: "#6b7280", textAlign: "center", padding: "48px" }}>
        <ShieldX size={48} strokeWidth={1.5} style={{ color: "#ef4444" }} />
        <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#111827" }}>Acceso restringido</h2>
        <p style={{ margin: 0, fontSize: "0.9rem" }}>No tienes permiso para acceder a esta sección.</p>
    </div>
)

const ProtectedRoute = ({ allowedRoles }: Props = {}) => {
    const location = useLocation()
    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/" replace state={{ from: location }} />
    }

    if (allowedRoles) {
        const stored = localStorage.getItem("user")
        const user = stored ? JSON.parse(stored) : null
        const role: number = user?.roles_id ?? 99
        if (!allowedRoles.includes(role)) {
            return <AccessDenied />
        }
    }

    return <Outlet />
}

export default ProtectedRoute
