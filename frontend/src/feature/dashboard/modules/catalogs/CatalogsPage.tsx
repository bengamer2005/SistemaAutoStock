import { DataTable, RowActions } from "../../components/common"
import { SectionPanel } from "../../components/sectionPanel"
import { useDashboard } from "../../context"
import { emptySimple } from "../../types"

const CatalogsPage = () => {
    const { query, setQuery, isLoading, catalogKind, setCatalogKind, categories, brands, loadData, openSimpleModal, setModalMode, deleteResource } = useDashboard()
    const normalizedQuery = query.toLowerCase()
    const filteredCategories = categories.filter((category) => `${category.name} ${category.description ?? ""}`.toLowerCase().includes(normalizedQuery))
    const filteredBrands = brands.filter((brand) => brand.brand_name.toLowerCase().includes(normalizedQuery))

    return (
        <SectionPanel activeTab="catalogs" catalogKind={catalogKind} setCatalogKind={setCatalogKind} query={query} setQuery={setQuery} isLoading={isLoading} onCreate={() => setModalMode("create")} onRefresh={loadData}>
            {catalogKind === "categories" && (
                <DataTable
                    rows={filteredCategories}
                    empty="No se encontraron categorias."
                    columns={[
                        ["Categoria", (item) => item.name],
                        ["Descripcion", (item) => item.description || "-"],
                        ["Padre", (item) => categories.find((category) => category.categories_id === item.parent_id)?.name ?? "-"],
                        [
                            "Acciones",
                            (item) => (
                                <RowActions
                                    onEdit={() => openSimpleModal({ ...emptySimple, id: item.categories_id, name: item.name, description: item.description ?? "", parent_id: item.parent_id ? String(item.parent_id) : "" })}
                                    onDelete={() => deleteResource(`/categories/${item.categories_id}`)}
                                />
                            ),
                        ],
                    ]}
                />
            )}

            {catalogKind === "brands" && (
                <DataTable
                    rows={filteredBrands}
                    empty="No se encontraron marcas."
                    columns={[
                        ["Marca", (item) => item.brand_name],
                        ["Acciones", (item) => <RowActions onEdit={() => openSimpleModal({ ...emptySimple, id: item.products_brands_id, brand_name: item.brand_name })} onDelete={() => deleteResource(`/brands/${item.products_brands_id}`)} />],
                    ]}
                />
            )}
        </SectionPanel>
    )
}

export default CatalogsPage
