import { useState, useMemo } from "react";
import FilterBar, { type FilterState } from "./FilterBar";

interface ProductData {
  slug: string;
  id: string;
  displayName: string;     // human-readable, aus YAML note Dateiname
  tier: 1 | 2 | 3;
  tagline: string;
  watch: string;
  status: string;
  primaryHomeMoc: string | null;
  isDeprecated: boolean;
}

interface Props {
  products: ProductData[];
  allMocs: string[];
}

export default function CatalogClient({ products, allMocs }: Props) {
  const url = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initial = {
    tier: (url.get("tier")?.split(",").map(Number) ?? []) as number[],
    moc: url.get("moc")?.split(",") ?? [],
    watch: url.get("watch")?.split(",") ?? [],
    status: url.get("status")?.split(",") ?? [],
  };
  const [filterState, setFilterState] = useState<FilterState>({
    tier: new Set(initial.tier as (1 | 2 | 3)[]),
    moc: new Set(initial.moc),
    watch: new Set(initial.watch as any),
    status: new Set(initial.status as any),
  });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filterState.tier.size && !filterState.tier.has(p.tier)) return false;
      if (filterState.moc.size && !(p.primaryHomeMoc && filterState.moc.has(p.primaryHomeMoc))) return false;
      if (filterState.watch.size && !filterState.watch.has(p.watch as any)) return false;
      if (filterState.status.size && !filterState.status.has(p.status as any)) return false;
      return true;
    });
  }, [products, filterState]);

  return (
    <>
      <FilterBar allMocs={allMocs} initial={initial} onChange={setFilterState} />
      <div className="text-sm text-gray-500 mt-2">{filtered.length} von {products.length} Produkten</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {filtered.map((p) => (
          <a
            key={p.slug}
            href={`/products/${p.slug}`}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 hover:no-underline transition no-underline"
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
