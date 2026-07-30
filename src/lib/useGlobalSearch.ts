"use client";

import { useEffect, useRef, useState } from "react";
import {
  getRecentlyPublishedItems,
  searchContentItems,
  type SearchableContentItem,
} from "@/lib/mockData";

export type SearchPhase = "recent" | "searching" | "results";

const SEARCH_DELAY_MS = 550;

export function useGlobalSearch(query: string) {
  const [phase, setPhase] = useState<SearchPhase>("recent");
  const [items, setItems] = useState<SearchableContentItem[]>(() => getRecentlyPublishedItems());
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (!query.trim()) {
      setPhase("recent");
      setItems(getRecentlyPublishedItems());
      return;
    }

    setPhase("searching");
    searchTimer.current = setTimeout(() => {
      setItems(searchContentItems(query));
      setPhase("results");
    }, SEARCH_DELAY_MS);

    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query]);

  return { phase, items };
}
