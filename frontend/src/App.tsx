import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { Toaster } from "sonner"
import Login from "./feature/auth/loginPage"
import MainPage from "./feature/dashboard/MainPage"
import NotFound from "./shared/404Page"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token")
    return token ? children : <Navigate to="/" replace />
}

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/main"
                        element={
                            <ProtectedRoute>
                                <MainPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>

            <Toaster position="bottom-right" richColors closeButton duration={3000} />
        </>
    )
}

export default App
