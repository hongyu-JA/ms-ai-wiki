import { useMemo } from "react";
import FilterBar from "./FilterBar";
import SearchBox from "./SearchBox";
import ArchMap from "./ArchMap";
import { useCatalogFilters, type ProductData } from "../lib/use-catalog-filters";
import type { ArchitectureGraph } from "../lib/load-architecture";

interface Props {
  graph: ArchitectureGraph;
  products: ProductData[];
  allMocs: string[];
}

export default function ArchMapClient({ graph, products, allMocs }: Props) {
  const { filterState, setFilterState, query, setQuery, filtered } = useCatalogFilters(products);

  // visibleSlugs = products in filter result, intersected with graph nodes
  const visibleSlugs = useMemo(() => {
    const filteredUrlSlugs = new Set(filtered.map((p) => p.slug)); // p.slug here is URL slug from Sub-Project A's ProductData
    const result = new Set<string>();
    for (const node of graph.nodes) {
      // node.slug is YAML slug, node.urlSlug is URL slug. Match against ProductData.slug (URL).
      if (filteredUrlSlugs.has(node.urlSlug)) {
        result.add(node.slug); // store as YAML slug since that's what ArchMap's filter check uses
      }
    }
    return result;
  }, [filtered, graph.nodes]);

  return (
    <>
      <div className="mb-3"><SearchBox initial={query} onChange={setQuery} /></div>
      <FilterBar initial={filterState} onChange={setFilterState} allMocs={allMocs} />
      <div className="text-sm text-gray-500 mt-2">
        {visibleSlugs.size} von {graph.nodes.length} Tools sichtbar
      </div>
      <ArchMap graph={graph} visibleSlugs={visibleSlugs} />
    </>
  );
}
