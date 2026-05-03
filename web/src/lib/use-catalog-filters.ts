import { useState, useMemo } from "react";
import type { FilterState } from "../components/FilterBar";

export interface ProductData {
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

export interface CatalogFilters {
  filterState: FilterState;
  setFilterState: (s: FilterState) => void;
  query: string;
  setQuery: (q: string) => void;
  filtered: ProductData[];
}

export function useCatalogFilters(products: ProductData[]): CatalogFilters {
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

  return { filterState, setFilterState, query, setQuery, filtered };
}
