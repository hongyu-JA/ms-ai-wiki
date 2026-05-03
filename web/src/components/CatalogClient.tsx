import { useState, useMemo } from "react";
import FilterBar, { type FilterState } from "./FilterBar";
import SearchBox from "./SearchBox";

interface ProductData {
  slug: string;
  id: string;
  displayName: string;
  tier: 1 | 2 | 3;
  tagline: string;
  watch: string;
  status: string;
  primaryHomeMoc: string | null;
  isDeprecated: boolean;
  aliases: string[];
}

interface Props {
  products: ProductData[];
  allMocs: string[];
}

const TIER_VALUES = [1, 2, 3] as const;
const WATCH_VALUES = ["close", "standard", "passive"] as const;
const STATUS_VALUES = ["ga", "preview", "deprecated", "eos"] as const;

function emptyFilter(): FilterState {
  return { tier: new Set(), moc: new Set(), watch: new Set(), status: new Set() };
}

function parseFilterFromUrl(): FilterState {
  if (typeof window === "undefined") return emptyFilter();
  const url = new URLSearchParams(window.location.search);
  const tierRaw = (url.get("tier")?.split(",").map(Number) ?? []) as number[];
  const mocRaw = url.get("moc")?.split(",") ?? [];
  const watchRaw = url.get("watch")?.split(",") ?? [];
  const statusRaw = url.get("status")?.split(",") ?? [];
  return {
    tier: new Set(tierRaw.filter((t): t is 1 | 2 | 3 => (TIER_VALUES as readonly number[]).includes(t))),
    moc: new Set(mocRaw),
    watch: new Set(watchRaw.filter((w): w is "close" | "standard" | "passive" => (WATCH_VALUES as readonly string[]).includes(w))),
    status: new Set(statusRaw.filter((s): s is "ga" | "preview" | "deprecated" | "eos" => (STATUS_VALUES as readonly string[]).includes(s))),
  };
}

function parseQueryFromUrl(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

export default function CatalogClient({ products, allMocs }: Props) {
  const [filterState, setFilterState] = useState<FilterState>(parseFilterFromUrl);
  const [query, setQuery] = useState<string>(parseQueryFromUrl);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (filterState.tier.size && !filterState.tier.has(p.tier)) return false;
      if (filterState.moc.size && !(p.primaryHomeMoc && filterState.moc.has(p.primaryHomeMoc))) return false;
      if (filterState.watch.size && !filterState.watch.has(p.watch as any)) return false;
      if (filterState.status.size && !filterState.status.has(p.status as any)) return false;
      if (q) {
        const hay = `${p.displayName} ${p.tagline} ${p.aliases.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, filterState, query]);

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
