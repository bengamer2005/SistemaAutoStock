import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SkeletonLoader } from "../utilities/loaders"
import Alerts from "../utilities/alerts"

export interface Column<T> {
    key: string
    header: string
    render?: (item: T) => ReactNode
    width?: string
    align?: "left" | "center" | "right"
}

export interface TableAction<T> {
    icon: ReactNode
    label: string
    onClick: (item: T) => void
    variant?: "default" | "primary" | "danger"
    show?: (item: T) => boolean 
}

export interface GenericTableProps<T> {
    data: T[]
    columns: Column<T>[]
    actions?: TableAction<T>[]
    keyExtractor: (item: T) => string | number
    
    pagination: {
        currentPage: number
        totalPages: number
        onPageChange: (page: number) => void
        itemsPerPage: number
        totalItems: number
    }
    
    isLoading?: boolean
    isError?: boolean
    emptyMessage?: string
    errorMessage?: string

    emptyType?: "info" | "warning"
}

function GenericTable<T>({
    data,
    columns,
    actions = [],
    keyExtractor,
    pagination,
    isLoading = false,
    isError = false,
    emptyMessage = "No se encontraron resultados",
    errorMessage = "Ocurrió un error al cargar los datos",
    emptyType = "warning"
}: GenericTableProps<T>) {

    const getAlignClass = (align?: string) => {
        return align === "center"
            ? "text-center"
            : align === "right"
            ? "text-right"
            : "text-left"
    }

    const getActionStyles = (variant?: string) => {
        const styles = {
            default: "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50",
            primary: "border-gray-200 text-gray-600 hover:border-[#78A890] hover:text-[#78A890] hover:bg-[#78A890]/5",
            danger: "border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50"
        }
        return styles[variant as keyof typeof styles] || styles.default
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">

                    {/* head */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-3 font-semibold text-gray-600 ${getAlignClass(column.align)} ${column.width || ""}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="px-6 py-3 font-semibold text-gray-600 text-center">
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>

                        {isLoading && (
                            <SkeletonLoader columns={columns.length + (actions.length ? 1 : 0)} />
                        )}

                        {isError && !isLoading && (
                            <tr>
                                <td colSpan={columns.length + (actions.length ? 1 : 0)}>
                                    <Alerts type="error" message={errorMessage} noPadding classnameAlert="rounded-t-none" />
                                </td>
                            </tr>
                        )}

                        {!isLoading && !isError && data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + (actions.length ? 1 : 0)}>
                                    <Alerts type={emptyType} message={emptyMessage} noPadding classnameAlert="rounded-t-none" />
                                </td>
                            </tr>
                        )}

                        {/* data */}
                        {!isLoading && !isError && data.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                className="border-b hover:bg-gray-50 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-6 py-2 ${getAlignClass(column.align)} text-gray-600`}
                                    >
                                        {column.render
                                            ? column.render(item)
                                            : String((item as any)[column.key] || "-")
                                        }
                                    </td>
                                ))}

                                {actions.length > 0 && (
                                    <td className="px-6 py-2">
                                        <div className="flex justify-center gap-2">
                                            {actions.map((action, index) => {
                                                if (action.show && !action.show(item)) return null

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => action.onClick(item)}
                                                        title={action.label}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${getActionStyles(action.variant)}`}
                                                    >
                                                        {action.icon}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            {pagination && !isLoading && !isError && data.length > 0 && (
                <div className="px-6 py-2 border-t border-gray-200 bg-white flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-
                        {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className={`px-2 py-1 flex items-center gap-2 rounded-lg border transition-all ${
                                pagination.currentPage === 1
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="px-2 py-2 text-sm text-gray-700">
                            Página {pagination.currentPage} de {pagination.totalPages}
                        </span>

                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className={`px-2 py-1 flex items-center gap-2 rounded-lg border transition-all ${
                                pagination.currentPage === pagination.totalPages
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GenericTable