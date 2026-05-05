import React from "react"
import { Phone, MapPin } from "lucide-react"

interface Address {
    street: string
    exteriorNumber: number
    neighborhood: string
    city: string
}

interface ClientTelephone {
    telephone: string
}

interface Client {
    clientsId: number
    name: string
    telephones: ClientTelephone[]
    address: Address | null
}

interface ClientCardProps {
    client: Client
    onClick?: (client: Client) => void
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
    return (
        <div role="button" tabIndex={0} onClick={() => onClick?.(client)} onKeyDown={(e) => e.key === "Enter" && onClick?.(client)} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-orange-300 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {client.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">
                        {client.name}
                    </h3>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
                {/* Phone Numbers */}
                <div className="flex items-start gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                        {client.telephones.map((tel) => (
                            <span key={tel.telephone} className="text-[15px]">{tel.telephone}</span>
                        ))}
                    </div>
                </div>

                {/* Address */}
                {client.address && (
                <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                        <span className="text-[15px]">
                            {client.address.street} {client.address.exteriorNumber}
                        </span>
                        <span className="text-[15px] text-gray-500">
                            {client.address.neighborhood}, {client.address.city}
                        </span>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}

// utils/createClientModal.ts
import Swal from "sweetalert2"
import { QueryClient } from "@tanstack/react-query"

const API_URL = import.meta.env.VITE_API_URL

export const openCreateClientModal = async (queryClient: QueryClient) => {
    const { value: name } = await Swal.fire({
        title: "Nuevo cliente",
        input: "text",
        inputLabel: "Nombre del cliente",
        inputPlaceholder: "Ej. Juan Pérez",
        showCancelButton: true,
        confirmButtonText: "Crear",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#ea580c",
        inputValidator: (value) => {
            if (!value || !value.trim()) {
                return "El nombre es obligatorio"
            }
            return null
        }
    })

    if (!name) return

    try {
        const response = await fetch(`${API_URL}/clients/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
        })

        if (!response.ok) {
        throw new Error("Error al crear cliente")
        }

        await Swal.fire({
        icon: "success",
        title: "Cliente creado",
        confirmButtonColor: "#16a34a"
        })

        queryClient.invalidateQueries({ queryKey: ["clientsInfo"] })

    } catch (error) {
        await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el cliente"
        })
    }
}