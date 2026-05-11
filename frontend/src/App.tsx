import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { Toaster } from "sonner"
import Login from "./feature/auth/loginPage"
import MainPage from "./feature/dashboard/MainPage"
import CatalogsPage from "./feature/dashboard/modules/catalogs/CatalogsPage"
import DashboardPage from "./feature/dashboard/modules/dashboard/DashboardPage"
import MovementsPage from "./feature/dashboard/modules/movements/MovementsPage"
import ProductsPage from "./feature/dashboard/modules/products/ProductsPage"
import ProvidersPage from "./feature/dashboard/modules/providers/ProvidersPage"
import UsersPage from "./feature/dashboard/modules/users/UsersPage"
import WarehousesPage from "./feature/dashboard/modules/warehouses/WarehousesPage"
import NotFound from "./shared/404Page"
import ProtectedRoute from "./shared/components/layout/protectedRoute"

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/main" element={<MainPage />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="products" element={<ProductsPage />} />
                            <Route path="movements" element={<MovementsPage />} />
                            <Route path="providers" element={<ProvidersPage />} />
                            <Route path="catalogs" element={<CatalogsPage />} />
                            <Route path="warehouses" element={<WarehousesPage />} />
                            <Route path="users" element={<UsersPage />} />
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
