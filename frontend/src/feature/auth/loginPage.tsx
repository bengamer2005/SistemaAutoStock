import { useState } from "react"
import { Navigate, useNavigate } from "react-router"
import { ArrowRight, Eye, EyeOff, Lock, Mail, PackageCheck } from "lucide-react"
import { toast } from "sonner"
import { loginRequest } from "./services/authService"

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const token = localStorage.getItem("token")
    if (token) return <Navigate to="/main" replace />

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const data = await loginRequest({ email, password })
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
            toast.success("Sesion iniciada")
            navigate("/main")
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al iniciar sesion"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="login-shell">
            <section className="login-panel" aria-label="Inicio de sesion">
                <div className="brand-mark">
                    <PackageCheck size={30} />
                </div>

                <div className="login-heading">
                    <span>SistemaAutoStock</span>
                    <h1>Control de inventario</h1>
                    <p>Accede para administrar productos, existencias y movimientos.</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <label>
                        Correo
                        <span className="input-with-icon">
                            <Mail size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="usuario@correo.com"
                                autoComplete="email"
                                required
                            />
                        </span>
                    </label>

                    <label>
                        Contrasena
                        <span className="input-with-icon">
                            <Lock size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Ingresa tu contrasena"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="icon-button ghost"
                                onClick={() => setShowPassword((current) => !current)}
                                aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </span>
                    </label>

                    <button className="primary-button" type="submit" disabled={isLoading}>
                        {isLoading ? "Validando..." : "Entrar"}
                        <ArrowRight size={18} />
                    </button>
                </form>
            </section>

            <section className="login-summary" aria-label="Resumen del sistema">
                <div>
                    <span className="eyebrow">Inventario operativo</span>
                    <h2>Productos, almacenes y movimientos en un solo panel.</h2>
                </div>
            </section>
        </main>
    )
}

export default Login
