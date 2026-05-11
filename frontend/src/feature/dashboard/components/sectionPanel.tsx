import type { ReactNode } from "react"
import { HeaderActions, SearchBox } from "./common"
import type { CatalogKind, Tab } from "../types"

export const SectionPanel = ({
    activeTab,
    catalogKind,
    setCatalogKind,
    query,
    setQuery,
    isLoading,
    onCreate,
    onRefresh,
    children,
}: {
    activeTab: Tab
    catalogKind: CatalogKind
    setCatalogKind: (kind: CatalogKind) => void
    query: string
    setQuery: (value: string) => void
    isLoading: boolean
    onCreate: () => void
    onRefresh: () => void
    children: ReactNode
}) => (
    <section className="panel">
        <div className="panel-header">
            <SearchBox value={query} onChange={setQuery} />
            <HeaderActions
                activeTab={activeTab}
                catalogKind={catalogKind}
                setCatalogKind={setCatalogKind}
                onCreate={onCreate}
                onRefresh={onRefresh}
            />
        </div>

        {isLoading ? <div className="loading-state">Cargando informacion...</div> : children}
    </section>
)
