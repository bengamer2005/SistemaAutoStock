export const useSearch = (
    data: any,
    searchTerm: string,
    filterFn: (item: any, term: string) => boolean
) => {
    return data.filter((item: any) => filterFn(item, searchTerm))
}