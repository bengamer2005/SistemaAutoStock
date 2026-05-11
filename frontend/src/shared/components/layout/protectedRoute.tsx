import { Navigate, Outlet, useLocation } from "react-router"

const ProtectedRoute = () => {
    const location = useLocation()
    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/" replace state={{ from: location }} />
    }

    return <Outlet />
}

export default ProtectedRoute
