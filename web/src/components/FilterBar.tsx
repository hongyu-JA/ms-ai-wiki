import { useState, useEffect, useRef } from "react";
import type { FilterState } from "../lib/use-catalog-filters";

export type { FilterState };

interface Props {
  allMocs: string[];
  initial: FilterState;
  onChange: (state: FilterState) => void;
}

interface ChipProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

function Chip({ active, label, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-full border transition ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterBar({ allMocs, initial, onChange }: Props) {
  const [tier, setTier] = useState<Set<1 | 2 | 3>>(initial.tier);
  const [moc, setMoc] = useState<Set<string>>(initial.moc);
  const [watch, setWatch] = useState<Set<"close" | "standard" | "passive">>(initial.watch);
  const [status, setStatus] = useState<Set<"ga" | "preview" | "deprecated" | "eos">>(initial.status);
  const isMount = useRef(true);

  useEffect(() => {
    if (isMount.current) {
      isMount.current = false;
      return;
    }
    const next: FilterState = { tier, moc, watch, status };
    onChange(next);
    // URL: preserve unknown params (e.g., ?q= from Task 6 SearchBox)
    const params = new URLSearchParams(window.location.search);
    if (tier.size) params.set("tier", [...tier].join(",")); else params.delete("tier");
    if (moc.size) params.set("moc", [...moc].join(",")); else params.delete("moc");
    if (watch.size) params.set("watch", [...watch].join(",")); else params.delete("watch");
    if (status.size) params.set("status", [...status].join(",")); else params.delete("status");
    const url = params.toString() ? `?${params}` : window.location.pathname;
    window.history.replaceState({}, "", url);
  }, [tier, moc, watch, status]);

  const toggle = <T,>(set: Set<T>, value: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs uppercase text-gray-500 mr-2">Tier:</span>
      {([1, 2, 3] as const).map((t) => (
        <Chip key={t} active={tier.has(t)} label={`T${t}`} onClick={() => toggle(tier, t, setTier)} />
      ))}
      <span className="text-xs uppercase text-gray-500 ml-3 mr-2">MOC:</span>
      {allMocs.map((m) => (
        <Chip key={m} active={moc.has(m)} label={m} onClick={() => toggle(moc, m, setMoc)} />
      ))}
      <span className="text-xs uppercase text-gray-500 ml-3 mr-2">Watch:</span>
      {(["close", "standard", "passive"] as const).map((w) => (
        <Chip key={w} active={watch.has(w)} label={w} onClick={() => toggle(watch, w, setWatch)} />
      ))}
      <span className="text-xs uppercase text-gray-500 ml-3 mr-2">Status:</span>
      {(["ga", "preview", "deprecated", "eos"] as const).map((s) => (
        <Chip key={s} active={status.has(s)} label={s} onClick={() => toggle(status, s, setStatus)} />
      ))}
    </div>
  );
}
