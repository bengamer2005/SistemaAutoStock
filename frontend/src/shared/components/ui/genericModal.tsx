import { XCircle } from "lucide-react"
import type { ReactNode } from "react"

interface ModalAction {
    label: string
    onClick: () => void
    variant?: "primary" | "secondary" | "danger"
    icon?: ReactNode
    loading?: boolean
    disabled?: boolean
}

interface GenericModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: ReactNode
    actions?: ModalAction[]
    size?: "sm" | "md" | "lg" | "xl"
}

const GenericModal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    actions = [],
    size = "md"
}: GenericModalProps) => {
    if (!isOpen) return null

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl"
    }

    const getButtonStyles = (variant: string = "secondary") => {
        const styles = {
            primary: "bg-gradient-to-r from-[#78A890] to-[#C0D890] text-white hover:shadow-lg",
            secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
            danger: "bg-white border border-red-300 text-red-600 hover:bg-red-50"
        }
        return styles[variant as keyof typeof styles] || styles.secondary
    }

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="px-6 md:px-8 py-6 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white rounded-t-2xl z-10">
                    <div className="flex-1 pr-4">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-sm text-gray-500 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex-shrink-0"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8">
                    {children}
                </div>

                {/* Modal Footer */}
                {actions.length > 0 && (
                    <div className="px-6 md:px-8 py-6 border-t border-gray-200 flex gap-3 bg-gray-50 rounded-b-2xl">
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                disabled={action.disabled || action.loading}
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyles(action.variant)}`}
                            >
                                {action.icon && <span>{action.icon}</span>}
                                {action.loading ? "Cargando..." : action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Animations */}
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
    )
}

export default GenericModal