import React, { useState, useEffect } from "react"
import { XCircle, Save, Phone, MapPin } from "lucide-react"
import { useCreateClient, useDeleteClient } from "../../../features/clients/hooks/useAllClientsService"
import type { Clients } from "../../../features/clients/types/clientsTypes"

type ModalMode = "view" | "edit" | "create"

interface ClientModalProps {
    mode: ModalMode
    client?: Clients | null
    isOpen: boolean
    onClose: () => void
    onSave?: (clientData: Partial<Clients>) => void
    onDeactivate?: (clientId: number) => void
}

const ClientModal: React.FC<ClientModalProps> = ({ mode, client, isOpen, onClose }) => {
    const [formData, setFormData] = useState<Partial<Clients>>({
        name: "",
        telephones: [],
        address: {
            street: "",
            exterior_number: "",
            neighborhood: "",
            city: 'Juarez',
            state: 'Nuevo León',
            postal_code: "",
            country: 'México',
            reference: "",
        },
    })

    const [phones, setPhones] = useState<string[]>([""])

    // cargar datos del cliente cuando se abre en modo view o edit
    useEffect(() => {
        if (isOpen && client && (mode === "view" || mode === "edit")) {
            setFormData(client)
            setPhones(client.telephones.map(t => t.telephone))
        } else if (isOpen && mode === "create") {
            // resetea el form para crear nuevo
            setFormData({
                name: "",
                telephones: [],
                address: {
                    street: "",
                    exterior_number: "",
                    neighborhood: "",
                    city: "Monterrey",
                    state: "Nuevo León",
                    postal_code: "",
                    country: "México",
                    reference: ""
                },
            });
            setPhones([""])
        }
    }, [isOpen, client, mode])

    const isViewMode = mode === "view"
    const isEditMode = mode === "edit"
    const isCreateMode = mode === "create"

    // Obtener iniciales del nombre
    const getInitials = (name: string) => {
        if (!name) return "?"
        const words = name.split(" ")
        if (words.length >= 2) {
            return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
        }
        return name.charAt(0).toUpperCase()
    }

    // Manejar cambios en inputs
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleAddressChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address!, [field]: value },
        }))
    }

    // Manejar teléfonos
    const handlePhoneChange = (index: number, value: string) => {
        const newPhones = [...phones]
        newPhones[index] = value
        setPhones(newPhones)
    }

    const addPhone = () => {
        setPhones([...phones, ''])
    }

    const removePhone = (index: number) => {
        if (phones.length > 1) {
            setPhones(phones.filter((_, i) => i !== index))
        }
    }

    // Guardar cambios
    const { mutate } = useCreateClient()

    const handleSave = () => {
        const clientData: any = {
            ...formData,
            modalMode: mode,
            telephones: phones.filter(p => p.trim() !== "").map((tel, i) => ({ 
                telephone: tel, 
                clients_tel_id: client?.telephones[i]?.clients_tel_id 
            })),
        }

        mutate(clientData)
        onClose()
    }

    const { mutate: deleteMutate } = useDeleteClient()

    // handle deactivate (solo en edit mode)
    const handleDeactivate = () => {
        if(client) {
            deleteMutate(client.clientsId)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
                {/* header */}
                <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isViewMode && "Detalles del Cliente"}
                        {isEditMode && "Editar Cliente"}
                        {isCreateMode && "Nuevo Cliente"}
                    </h2>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>

                {/* body */}
                <div className="p-8">
                    {/* view header */}
                    {isViewMode && client && (
                        <div className="flex items-center gap-6 pb-6 border-b border-gray-200 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#78A890] to-[#C0D890] rounded-2xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                                {getInitials(client.name)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                    {client.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Cliente desde {new Date(client.created_at).toLocaleDateString("es-MX", { 
                                        year: "numeric", 
                                        month: "long" 
                                    })}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form Fields (edit y create mode) */}
                    {(isEditMode || isCreateMode) && (
                        <div className="mb-6">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Información Básica
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre completo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Ej: Juan Pérez"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div className="mb-6">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Información de Contacto
                        </h4>

                        {isViewMode && client ? (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-[#78A890]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-[#78A890]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Teléfonos</p>
                                    {client.telephones.length > 0 ? (
                                        client.telephones.map((tel, idx) => (
                                            <p key={idx} className="text-gray-900 font-medium">
                                                {tel.telephone}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic">Sin teléfonos</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {phones.map((phone, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => handlePhoneChange(index, e.target.value)}
                                            placeholder="8112345678"
                                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10"
                                        />
                                        {phones.length > 1 && (
                                            <button type="button" onClick={() => removePhone(index)} className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addPhone} className="text-sm text-[#78A890] font-medium hover:text-[#C0D890] transition-colors">
                                    + Agregar otro teléfono
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Address */}
                    <div className="mb-6">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Dirección
                        </h4>

                        {isViewMode && client?.address ? (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-[#78A890]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-[#78A890]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                        Dirección completa
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {client.address.street} #{client.address.exterior_number}
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {client.address.neighborhood}, {client.address.city}
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {client.address.state}, CP {client.address.postal_code}
                                    </p>
                                    {client.address.reference && (
                                        <p className="text-gray-500 text-sm italic mt-2">
                                            Ref: {client.address.reference}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Calle
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address?.street || ""}
                                        onChange={(e) => handleAddressChange("street", e.target.value)}
                                        placeholder="Av. Constitución"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número exterior
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address?.exterior_number || ""}
                                            onChange={(e) => handleAddressChange("exterior_number", e.target.value)}
                                            placeholder="123"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Colonia
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address?.neighborhood || ""}
                                            onChange={(e) => handleAddressChange("neighborhood", e.target.value)}
                                            placeholder="Centro"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Código postal
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address?.postal_code || ""}
                                            onChange={(e) => handleAddressChange("postal_code", e.target.value)}
                                            placeholder="64000"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ciudad
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address?.city || ""}
                                            onChange={(e) => handleAddressChange("city", e.target.value)}
                                            placeholder="Monterrey"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Estado
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address?.state || ""}
                                            onChange={(e) => handleAddressChange("state", e.target.value)}
                                            placeholder="Nuevo León"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Referencias
                                    </label>
                                    <textarea
                                        value={formData.address?.reference || ""}
                                        onChange={(e) => handleAddressChange("reference", e.target.value)}
                                        placeholder="Ej: Casa blanca con portón negro..."
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10"
                                    />
                                </div>

                                <div>
                                    <button type="button" onClick={() => handleDeactivate()} className="w-full px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                        Eliminar cliente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t border-gray-200 flex gap-4 bg-gray-50 rounded-b-2xl">
                    {(isEditMode || isCreateMode) && (
                        <>
                            <button 
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#78A890] to-[#C0D890] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {isCreateMode ? "Crear Cliente" : "Guardar Cambios"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ClientModal