import FilterBar from "./FilterBar";
import SearchBox from "./SearchBox";
import { useCatalogFilters, type ProductData } from "../lib/use-catalog-filters";

interface Props {
  products: ProductData[];
  allMocs: string[];
}

export default function TableClient({ products, allMocs }: Props) {
  const { filterState, setFilterState, query, setQuery, filtered } = useCatalogFilters(products);

  return (
    <>
      <div className="mb-3"><SearchBox initial={query} onChange={setQuery} /></div>
      <FilterBar initial={filterState} onChange={setFilterState} allMocs={allMocs} />
      <div className="text-sm text-gray-500 mt-2">{filtered.length} von {products.length} Produkten</div>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm bg-white border border-gray-200 rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2">Produkt</th>
              <th className="text-left px-3 py-2 w-16">Tier</th>
              <th className="text-left px-3 py-2 w-24">Watch</th>
              <th className="text-left px-3 py-2 w-24">Status</th>
              <th className="text-left px-3 py-2 w-40">Primary MOC</th>
              <th className="text-left px-3 py-2">Tagline</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.slug} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2"><a href={`/products/${p.slug}`} className="font-semibold">{p.displayName}</a></td>
                <td className="px-3 py-2"><span className={`badge badge-tier-${p.tier}`}>T{p.tier}</span></td>
                <td className="px-3 py-2"><span className={`badge badge-watch-${p.watch}`}>{p.watch}</span></td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2 text-gray-600">{p.primaryHomeMoc ?? "—"}</td>
                <td className="px-3 py-2 text-gray-600">{p.tagline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
