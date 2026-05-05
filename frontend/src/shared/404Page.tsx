import { Link } from "react-router"

const NotFound = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-8xl font-light text-blue-700 tracking-tight">
                        404
                    </h1>
                </div>

                <div className="space-y-3 mb-10">
                    <h2 className="text-2xl font-medium text-gray-900">
                        Página no encontrada
                    </h2>
                    <p className="text-gray-500">
                        La página que buscas no existe.
                    </p>
                </div>

                <Link to="/" className="inline-block px-8 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-600 transition-colors">
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}

export default NotFound