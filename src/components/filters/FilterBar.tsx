"use client";

import { useMemo, useState } from "react";
import { FilterChip } from "@/components/FilterChip";
import { DateFilter, type DateFilterValue } from "@/components/filters/DateFilter";
import {
  MultiSelectDropdown,
  type MultiSelectOption,
} from "@/components/filters/MultiSelectDropdown";
import { useTimeFilter } from "@/contexts/TimeFilterContext";

type FilterBarVariant = "overview" | "contentPerformance";

type MultiFilterKey =
  | "brands"
  | "regions"
  | "contentTypes"
  | "categories"
  | "licenses"
  | "devices"
  | "granularity";

const OPTIONS: Record<MultiFilterKey, MultiSelectOption[]> = {
  brands: [
    { id: "usa-today", label: "USA TODAY" },
    { id: "az-central", label: "azcentral" },
    { id: "freep", label: "Freep" },
    { id: "indystar", label: "IndyStar" },
    { id: "detroit-news", label: "The Detroit News" },
  ],
  regions: [
    { id: "us", label: "United States" },
    { id: "ca", label: "Canada" },
    { id: "uk", label: "United Kingdom" },
    { id: "au", label: "Australia" },
  ],
  contentTypes: [
    { id: "article", label: "Article" },
    { id: "gallery", label: "Gallery" },
    { id: "video", label: "Video" },
  ],
  categories: [
    { id: "news", label: "News" },
    { id: "sports", label: "Sports" },
    { id: "entertainment", label: "Entertainment" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "finance", label: "Finance" },
  ],
  licenses: [
    { id: "syndicated", label: "Syndicated" },
    { id: "owned-operated", label: "Owned & operated" },
    { id: "partner", label: "Partner" },
  ],
  devices: [
    { id: "mobile", label: "Mobile" },
    { id: "desktop", label: "Desktop" },
    { id: "tablet", label: "Tablet" },
  ],
  granularity: [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ],
};

function presetLabel(preset: "last30" | "last14" | "last7" | "last24h" | "mtd") {
  switch (preset) {
    case "last30":
      return "Last 30 days";
    case "last14":
      return "Last 14 days";
    case "last7":
      return "Last 7 days";
    case "last24h":
      return "Last 24 hours";
    case "mtd":
      return "Month to date";
  }
}

function dateChipLabel(value: DateFilterValue) {
  if (value.mode === "preset") return presetLabel(value.preset);
  return `${value.startISO} – ${value.endISO}`;
}


export function FilterBar({ variant }: { variant: FilterBarVariant }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const timeFilter = useTimeFilter();
  const dateValue = timeFilter.dateValue;
  const setDateValue = timeFilter.setDateValue;

  const [selected, setSelected] = useState<Record<MultiFilterKey, string[]>>({
    brands: [],
    regions: [],
    contentTypes: [],
    categories: [],
    licenses: [],
    devices: [],
    granularity: [],
  });

  const filters = useMemo(() => {
    if (variant === "overview") {
      return [
        { key: "brands" as const, label: "Brands" },
        { key: "regions" as const, label: "Regions" },
        { key: "contentTypes" as const, label: "Content types" },
        { key: "categories" as const, label: "Categories" },
        { key: "licenses" as const, label: "Licenses" },
      ];
    }

    return [
      { key: "granularity" as const, label: "Granularity" },
      { key: "licenses" as const, label: "Licenses" },
      { key: "categories" as const, label: "Categories" },
      { key: "contentTypes" as const, label: "Content types" },
      { key: "regions" as const, label: "Regions" },
      { key: "devices" as const, label: "Devices" },
      { key: "brands" as const, label: "Brands" },
    ];
  }, [variant]);

  function toggleId(key: MultiFilterKey, id: string) {
    setSelected((prev) => {
      const set = new Set(prev[key]);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, [key]: Array.from(set) };
    });
  }

  function clearKey(key: MultiFilterKey) {
    setSelected((prev) => ({ ...prev, [key]: [] }));
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DateFilter
        open={openKey === "date"}
        onOpenChange={(next) => setOpenKey(next ? "date" : null)}
        value={dateValue}
        onChange={(next) => {
          setDateValue(next);
        }}
        trigger={
          <FilterChip
            label={dateChipLabel(dateValue)}
            variant="applied"
            isOpen={openKey === "date"}
            onClick={() => setOpenKey(openKey === "date" ? null : "date")}
            onClear={() => {
              setDateValue({ mode: "preset", preset: "last7" });
              setOpenKey(null);
            }}
          />
        }
      />

      {filters.map((f) => {
        const count = selected[f.key].length;
        const isApplied = count > 0;
        const isOpen = openKey === f.key;

        return (
          <MultiSelectDropdown
            key={f.key}
            label={f.label}
            options={OPTIONS[f.key]}
            selectedIds={selected[f.key]}
            open={isOpen}
            onOpenChange={(next) => setOpenKey(next ? f.key : null)}
            onToggleId={(id) => toggleId(f.key, id)}
            onClear={() => clearKey(f.key)}
            searchable={f.key === "brands" || f.key === "regions" || f.key === "categories"}
            trigger={
              <FilterChip
                label={f.label}
                count={count > 0 ? count : undefined}
                variant={isApplied ? "applied" : "dropdown"}
                isOpen={isOpen}
                onClick={() => setOpenKey(isOpen ? null : f.key)}
              />
            }
          />
        );
      })}
    </div>
  );
}

