import FilterBar from "./FilterBar";
import SearchBox from "./SearchBox";
import { useCatalogFilters, type ProductData } from "../lib/use-catalog-filters";

interface Props {
  products: ProductData[];
  allMocs: string[];
}

export default function CatalogClient({ products, allMocs }: Props) {
  const { filterState, setFilterState, query, setQuery, filtered } = useCatalogFilters(products);

  return (
    <>
      <div className="mb-3"><SearchBox initial={query} onChange={setQuery} /></div>
      <FilterBar initial={filterState} onChange={setFilterState} allMocs={allMocs} />
      <div className="text-sm text-gray-500 mt-2">{filtered.length} von {products.length} Produkten</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {filtered.map((p) => (
          <a
            key={p.slug}
            href={`/products/${p.slug}`}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition no-underline"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge badge-tier-${p.tier}`}>T{p.tier}</span>
              <span className={`badge badge-watch-${p.watch}`}>{p.watch}</span>
              {p.status === "deprecated" && <span className="badge badge-status-deprecated">deprecated</span>}
              {p.status === "eos" && <span className="badge badge-status-eos">EOS</span>}
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1 mt-0">{p.displayName}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{p.tagline}</p>
          </a>
        ))}
      </div>
    </>
  );
}
