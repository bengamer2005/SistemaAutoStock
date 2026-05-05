import { useState } from "react"
import { useNavigate, Navigate } from "react-router"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "./hooks/useLogin"
import Alerts from "./../../shared/components/feedback/alerts"

const Login = () => {
    const { mutate, isPending, error } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    // estados para el login 
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        mutate({ email, password }, {
            onSuccess: () => {
                navigate("/main")
            }
        })
    }

    const token = localStorage.getItem("token")
    if (token) {
        return <Navigate to="/main" replace />
    }

    return (
        <div className="min-h-screen w-screen bg-grid">
            <div className="flex items-center justify-center h-full h-">
                
                <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
                    <div className="w-full max-w-md">
                        {/* Logo/Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Bienvenido
                            </h1>
                            <p className="text-gray-600">
                                Ingresa tus credenciales
                            </p>
                        </div>

                        {/* Forms Container with slide animation */}
                        <div className="relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
                            <div 
                                className="flex transition-transform duration-500 ease-in-out"
                            >
                                {/* Login Form */}
                                <div className="w-full flex-shrink-0 p-8">
                                    <form onSubmit={handleLogin} className="space-y-5">
                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Correo Electrónico
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="tu@email.com"
                                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contraseña
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="w-full py-3 bg-[#78A890] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-6"
                                        >
                                            {isPending ? "Cargando" : "Iniciar Sesión"}
                                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                                        </button>

                                        {/* Toggle to Register */}
                                        <div className="text-center pt-4">
                                            <p className="text-sm text-gray-600">
                                                ¿No tienes cuenta?{" "}
                                                <button
                                                    type="button"
                                                    onClick={() => console.log("intentado solicitar jejej")}
                                                    className="text-[#78A890] font-semibold hover:text-[#C0D890] transition-colors"
                                                >
                                                    Solicita una aqui
                                                </button>
                                            </p>
                                        </div>
                                    </form>

                                    {error && <Alerts type="error" message={error.message} noPadding classname="pt-4"/>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    )
}

export default Login