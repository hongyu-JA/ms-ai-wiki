import { useState, useEffect, useRef } from "react";

interface Props {
  initial?: string;
  onChange: (q: string) => void;
}

export default function SearchBox({ initial = "", onChange }: Props) {
  const [q, setQ] = useState(initial);
  const isMount = useRef(true);

  useEffect(() => {
    if (isMount.current) {
      isMount.current = false;
      return;
    }
    onChange(q);
    // URL state updaten — search-param "q". Preserve unknown params.
    const params = new URLSearchParams(window.location.search);
    if (q) params.set("q", q);
    else params.delete("q");
    const url = params.toString() ? `?${params}` : window.location.pathname;
    window.history.replaceState({}, "", url);
  }, [q]);

  return (
    <input
      type="search"
      placeholder="Suche in Titel, Tagline, Aliases..."
      className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
  );
}
