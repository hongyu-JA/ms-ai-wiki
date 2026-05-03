import { useState, useEffect } from "react";

export interface FilterState {
  tier: Set<1 | 2 | 3>;
  moc: Set<string>;
  watch: Set<"close" | "standard" | "passive">;
  status: Set<"ga" | "preview" | "deprecated" | "eos">;
}

interface Props {
  allMocs: string[];
  initial?: Partial<{ tier: number[]; moc: string[]; watch: string[]; status: string[] }>;
  onChange: (state: FilterState) => void;
}

export default function FilterBar({ allMocs, initial, onChange }: Props) {
  const [tier, setTier] = useState(new Set<1 | 2 | 3>(
    (initial?.tier ?? []) as (1 | 2 | 3)[]
  ));
  const [moc, setMoc] = useState(new Set<string>(initial?.moc ?? []));
  const [watch, setWatch] = useState(new Set<string>(initial?.watch ?? []));
  const [status, setStatus] = useState(new Set<string>(initial?.status ?? []));

  useEffect(() => {
    onChange({ tier, moc, watch, status } as FilterState);
    // URL-State updaten
    const params = new URLSearchParams();
    if (tier.size) params.set("tier", [...tier].join(","));
    if (moc.size) params.set("moc", [...moc].join(","));
    if (watch.size) params.set("watch", [...watch].join(","));
    if (status.size) params.set("status", [...status].join(","));
    const url = params.toString() ? `?${params}` : window.location.pathname;
    window.history.replaceState({}, "", url);
  }, [tier, moc, watch, status]);

  const toggle = <T,>(set: Set<T>, value: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  };

  const Chip = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
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
