import { useState } from "react"

export const usePagination = (data: any, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(data.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    const paginatedData = data.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return {
        currentPage,
        totalPages,
        paginatedData,
        handlePageChange,
        itemsPerPage,
        totalItems: data.length
    }
}