import { useEffect, useState } from "react";
import useSWR from "swr";
import { filesApi } from "@/api/files";
import { MIN_QUERY } from "@/lib/searchFiles";

const DEBOUNCE_MS = 300;

/** ყველა ფაილში ძებნა სერვერზე; ბეჭდვისას თითო ასოზე არა — 300ms პაუზის შემდეგ */
export function useFileSearch(query: string, enabled: boolean) {
  const [q, setQ] = useState(query.trim());
  useEffect(() => {
    const id = setTimeout(() => setQ(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);
  const active = enabled && q.length >= MIN_QUERY;
  const { data, isLoading } = useSWR(active ? ["file-search", q] : null, () => filesApi.search(q), { keepPreviousData: true });
  return { groups: active ? (data ?? []) : [], loading: active && isLoading && !data };
}
