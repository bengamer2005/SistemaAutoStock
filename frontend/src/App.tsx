import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { Toaster } from "sonner"
import Login from "./feature/auth/loginPage"
import MainPage from "./feature/dashboard/MainPage"
import CatalogsPage from "./feature/dashboard/modules/catalogs/CatalogsPage"
import DashboardPage from "./feature/dashboard/modules/dashboard/DashboardPage"
import MovementsPage from "./feature/dashboard/modules/movements/MovementsPage"
import ProductsPage from "./feature/dashboard/modules/products/ProductsPage"
import ProvidersPage from "./feature/dashboard/modules/providers/ProvidersPage"
import ReportsPage from "./feature/dashboard/modules/reports/ReportsPage"
import UsersPage from "./feature/dashboard/modules/users/UsersPage"
import WarehousesPage from "./feature/dashboard/modules/warehouses/WarehousesPage"
import NotFound from "./shared/404Page"
import ProtectedRoute from "./shared/components/layout/protectedRoute"

const DefaultRedirect = () => {
    const stored = localStorage.getItem("user")
    const role: number = stored ? (JSON.parse(stored)?.roles_id ?? 99) : 99
    return <Navigate to={role === 1 ? "dashboard" : "products"} replace />
}

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/main" element={<MainPage />}>
                            <Route index element={<DefaultRedirect />} />
                            <Route element={<ProtectedRoute allowedRoles={[1]} />}>
                                <Route path="dashboard" element={<DashboardPage />} />
                                <Route path="users" element={<UsersPage />} />
                                <Route path="providers" element={<ProvidersPage />} />
                                <Route path="catalogs" element={<CatalogsPage />} />
                                <Route path="warehouses" element={<WarehousesPage />} />
                            </Route>
                            <Route path="products" element={<ProductsPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                            <Route element={<ProtectedRoute allowedRoles={[1, 2]} />}>
                                <Route path="movements" element={<MovementsPage />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>

            <Toaster position="bottom-right" richColors closeButton duration={3000} />
        </>
    )
}

export default App
