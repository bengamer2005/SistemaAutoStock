import { BrowserRouter, Route, Routes } from "react-router"
import { Toaster } from "sonner"
import ProtectedRoute from "./shared/components/layout/protectedRoute"
// pages
import NotFound from "./shared/404Page"
// estilos
import "./index.css"

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Loging/>}/>
                    <Route path="*" element={<NotFound/>}/>
                    <Route element={<ProtectedRoute/>}>
                        <Route path="/main" element={<MainPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>

            <Toaster 
                position="bottom-right"
                expand={false}
                richColors
                closeButton
                duration={3000}
            />
        </>
    )
}

export default App