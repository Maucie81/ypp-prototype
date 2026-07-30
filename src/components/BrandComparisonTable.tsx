"use client";

import { useState } from "react";
import { DeltaArrowIcon } from "@/components/DeltaArrowIcon";
import type { BrandComparisonRow } from "@/lib/mockData";

type SortKey = keyof BrandComparisonRow;
type SortDir = "asc" | "desc";

interface ColDef {
  key: SortKey;
  label: string;
  align: "left" | "center";
}

const COLUMNS: ColDef[] = [
  { key: "rank", label: "Rank", align: "center" },
  { key: "brand", label: "Brand", align: "left" },
  { key: "views", label: "Views", align: "left" },
  { key: "reach", label: "Reach", align: "center" },
  { key: "ctr", label: "CTR", align: "center" },
  { key: "averageDwell", label: "Average dwell", align: "center" },
  { key: "comments", label: "Comments", align: "center" },
  { key: "contentCount", label: "Content count", align: "center" },
];

function formatValue(key: SortKey, row: BrandComparisonRow): string {
  switch (key) {
    case "ctr":
    case "averageDwell":
      return (row[key] as number).toFixed(1);
    case "brand":
      return row.brand;
    default:
      return (row[key] as number).toLocaleString("en-US");
  }
}

export function BrandComparisonTable({ rows }: { rows: BrandComparisonRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const dir = sortDir === "desc" ? -1 : 1;
    if (typeof av === "string" && typeof bv === "string")
      return av.localeCompare(bv) * dir;
    return ((av as number) - (bv as number)) * dir;
  });

  const maxViews = Math.max(1, ...rows.map((r) => r.views));

  const cellBase =
    "h-[46px] bg-white px-3 py-3 align-middle font-yahoo-product-sans text-[14px] leading-5 text-[#464e56] tabular-nums";

  return (
    <div className="w-full overflow-hidden rounded-[4px]">
      <table className="w-full table-fixed border-separate border-spacing-0">
        <colgroup>
          <col className="w-[7%]" />
          <col className="w-[10%]" />
          <col className="w-[25%]" />
          <col className="w-[11.6%]" />
          <col className="w-[11.6%]" />
          <col className="w-[11.6%]" />
          <col className="w-[11.6%]" />
          <col className="w-[11.6%]" />
        </colgroup>

        <thead>
          <tr>
            {COLUMNS.map((col) => {
              const isSorted = col.key === sortKey;
              const isViews = col.key === "views";
              return (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => handleSort(col.key)}
                  className={[
                    "h-[52px] cursor-pointer select-none border-b bg-white px-3 align-middle",
                    "font-yahoo-product-sans text-[14px] font-medium leading-5",
                    "hover:bg-[#f9fafb] transition-colors duration-100",
                    isViews ? "border-[#f0f3f5]" : "border-[#e0e4e9]",
                    isSorted ? "text-[#232a31]" : "text-[#464e56]",
                    col.align === "center" ? "text-center" : "text-left",
                  ].join(" ")}
                >
                  <span
                    className={`inline-flex items-center gap-1 ${
                      col.align === "center" ? "justify-center w-full" : ""
                    }`}
                  >
                    {col.label}
                    {isSorted && (
                      <DeltaArrowIcon
                        direction={sortDir === "desc" ? "up" : "down"}
                        className="h-3 w-3 shrink-0 text-[#6a6a6a]"
                      />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {/* Spacer row */}
          <tr>
            {Array.from({ length: 8 }).map((_, i) => (
              <td key={i} className="h-[8px] bg-white" aria-hidden />
            ))}
          </tr>

          {sorted.map((row, idx) => {
            const isLast = idx === rows.length - 1;
            const borderClass = isLast ? "" : "border-b border-[#e3e3e3]";
            const barPct = Math.max(3, Math.round((row.views / maxViews) * 100));

            return (
              <tr key={row.brand}>
                {/* Rank — match header center */}
                <td
                  className={`${cellBase} text-center text-[#232a31] ${borderClass}`}
                >
                  {row.rank}
                </td>

                {/* Brand — match header left */}
                <td className={`${cellBase} text-left ${borderClass}`}>
                  <span
                    className="block truncate font-medium underline text-[#464e56]"
                    title={row.brand}
                  >
                    {row.brand}
                  </span>
                </td>

                {/* Views — match header left */}
                <td className={`${cellBase} text-left ${borderClass}`}>
                  <div className="group relative">
                    <div
                      className="h-[16px] rounded-l-[2px] rounded-r-[12px] bg-[#6866e9]"
                      style={{ width: `${barPct}%` }}
                      aria-label={`${row.views.toLocaleString("en-US")} views`}
                    />
                    {/* Tooltip centered on the bar's midpoint */}
                    <div
                      className="pointer-events-none absolute bottom-full z-10 mb-1.5 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex flex-col items-center"
                      style={{ left: `${barPct / 2}%` }}
                    >
                      <div className="rounded-[4px] bg-[#232a31] px-2 py-1 font-yahoo-product-sans text-[12px] leading-4 text-white shadow-md whitespace-nowrap">
                        {row.views.toLocaleString("en-US")}
                      </div>
                      <svg width="8" height="4" viewBox="0 0 8 4" aria-hidden>
                        <path d="M0 0 L4 4 L8 0 Z" fill="#232a31" />
                      </svg>
                    </div>
                  </div>
                </td>

                {/* Remaining metric columns */}
                {(
                  [
                    "reach",
                    "ctr",
                    "averageDwell",
                    "comments",
                    "contentCount",
                  ] as SortKey[]
                ).map((key) => (
                  <td
                    key={key}
                    className={`${cellBase} text-center ${borderClass}`}
                  >
                    {formatValue(key, row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
