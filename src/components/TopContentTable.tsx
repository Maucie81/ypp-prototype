"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@yahoo/uds";
import { Article, VideoCamera, ImageGallery } from "@yahoo/uds-icons";
import { BrandIcon } from "@/components/BrandIcon";
import { DeltaArrowIcon } from "@/components/DeltaArrowIcon";
import { ContentDetailsModal } from "@/components/ContentDetailsModal";
import { Toast } from "@/components/ui/Toast";
import type { TopContentRow, ContentModalItem } from "@/lib/mockData";

const COLUMNS: { key: keyof TopContentRow; header: string; align: "left" | "center" | "right" }[] = [
  { key: "rank", header: "Rank", align: "center" },
  { key: "contentTitle", header: "Content title", align: "left" },
  { key: "brand", header: "Brand", align: "center" },
  { key: "views", header: "Views", align: "right" },
  { key: "visitors", header: "Visitors", align: "right" },
  { key: "reach", header: "Reach", align: "right" },
  { key: "ctr", header: "CTR", align: "right" },
  { key: "dwell", header: "Dwell", align: "right" },
  { key: "engagements", header: "Engagements", align: "center" },
];

const COLGROUP = (
  <colgroup>
    <col className="w-[6%]" />
    <col className="w-[26%]" />
    <col className="w-[10%]" />
    <col className="w-[10%]" />
    <col className="w-[10%]" />
    <col className="w-[10%]" />
    <col className="w-[8%]" />
    <col className="w-[8%]" />
    <col className="w-[12%]" />
  </colgroup>
);

/** Collapses the row's content type into the 3 buckets ContentDetailsModal understands. */
function modalContentType(contentType: string): "video" | "slideshow" | "article" {
  const lower = contentType.toLowerCase();
  if (lower === "video" || lower === "live") return "video";
  if (lower === "slideshow" || lower === "gallery") return "slideshow";
  return "article";
}

function contentTypeIcon(contentType: string) {
  switch (modalContentType(contentType)) {
    case "video":
      return VideoCamera;
    case "slideshow":
      return ImageGallery;
    default:
      return Article;
  }
}

function alignClass(align: "left" | "center" | "right") {
  return align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
}

type SortKey = keyof TopContentRow;
type SortDir = "asc" | "desc";

function compare(a: TopContentRow, b: TopContentRow, key: SortKey, dir: SortDir): number {
  const va = a[key];
  const vb = b[key];
  if (typeof va === "number" && typeof vb === "number") {
    return dir === "asc" ? va - vb : vb - va;
  }
  const sa = String(va);
  const sb = String(vb);
  const cmp = sa.localeCompare(sb);
  return dir === "asc" ? cmp : -cmp;
}

const headerRowClass =
  "group h-[52px] cursor-pointer select-none border-b border-[#e0e4e9] bg-white px-3 align-middle font-yahoo-product-sans text-[14px] font-medium leading-5 hover:bg-[#f9fafb] transition-colors duration-100";

export function TopContentTable({
  rows,
  fixedHeaderLayout = false,
}: {
  rows: TopContentRow[];
  fixedHeaderLayout?: boolean;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedArticle, setSelectedArticle] = useState<ContentModalItem | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  const sorted = [...rows].sort((a, b) => compare(a, b, sortKey, sortDir));

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const headerRow = (
    <tr>
      {COLUMNS.map(({ key, header, align }) => {
        const isSorted = key === sortKey;
        return (
          <th
            key={key}
            scope="col"
            onClick={() => handleSort(key)}
            className={[
              headerRowClass,
              isSorted ? "text-[#232a31]" : "text-[#464e56]",
              alignClass(align),
            ].join(" ")}
          >
            <span
              className={`inline-flex items-center gap-1 ${
                align === "center" ? "justify-center w-full" : align === "right" ? "justify-end w-full" : ""
              }`}
            >
              {header}
              {isSorted ? (
                <DeltaArrowIcon
                  direction={sortDir === "desc" ? "up" : "down"}
                  className="h-3 w-3 shrink-0 text-[#6a6a6a]"
                />
              ) : (
                <svg
                  width="10" height="12" viewBox="0 0 10 12" fill="none"
                  aria-hidden
                  className="h-3 w-2.5 shrink-0 text-[#b0b8c1] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <path d="M3 4.5L5 2L7 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 7.5L5 10L7 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
          </th>
        );
      })}
    </tr>
  );

  const bodyRows = sorted.map((row) => (
    <tr key={`${row.rank}-${row.contentTitle}`} className="transition-colors hover:bg-[#f5f8fa]">
      <td className="h-[56px] border-b border-[#f0f3f5] px-3 py-4 text-center align-middle font-yahoo-product-sans text-[14px] leading-5 text-[#232a31]">
        {row.rank}
      </td>
      <td className="h-[56px] w-0 border-b border-[#f0f3f5] px-3 py-4 text-left align-middle">
        <div className="flex min-w-0 items-center gap-3">
          <Icon
            name={contentTypeIcon(row.contentType)}
            size="sm"
            variant="outline"
            className="h-4 w-4 shrink-0"
            style={{ color: "#464E56" }}
            aria-hidden
          />
          <button
            onClick={() => {
              setSelectedArticle({
                id: `${row.rank}-${row.contentTitle}`,
                title: row.contentTitle,
                description: `Published on ${new Date().toLocaleDateString()}`,
                snippet: "During Thursday's interview with CNN, Vice President Kamala Harris reiterated her support for a bipartisan Senate bill that would have overhauled the country's immigration system in an effort to cut down on the number of undocumented migr...",
                contentType: modalContentType(row.contentType),
                thumbnailSeed: row.rank,
                publishedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                status: "Published",
              });
            }}
            className="min-w-0 flex-1 truncate text-left font-yahoo-product-sans text-[14px] leading-5 underline text-[#232a31] cursor-pointer"
            title={row.contentTitle}
          >
            {row.contentTitle}
          </button>
        </div>
      </td>
      <td className="h-[56px] border-b border-[#f0f3f5] px-3 py-4 text-center align-middle">
        <BrandIcon brand={row.brand} />
      </td>
      <td className="h-[56px] border-b border-[#f0f3f5] px-3 py-4 text-right align-middle font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] tabular-nums">
        {row.views.toLocaleString("en-US")}
      </td>
      <td className="h-[56px] border-b border-[#f0f3f5] px-3 py-4 text-right align-middle font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] tabular-nums">
        {row.visitors.toLocaleString("en-US")}
      </td>
      <td className="h-[56px] border-b border-[#f0f3f5] px-3 py-4 text-right align-middle font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] tabular-nums">
        {row.reach.toLocaleString("en-US")}
      </td>
      <td className="h-[56px] border-b border-[#f0f3f5] px-3 py-4 text-right align-middle font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] tabular-nums">
        {row.ctr}%
      </td>
      <td className="h-[56px] border-b border-[#f0f3f5] px-3 py-4 text-right align-middle font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] tabular-nums">
        {row.dwell}
      </td>
      <td className="h-[56px] border-b border-[#f0f3f5] px-3 py-4 text-center align-middle font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] tabular-nums">
        {row.engagements.toLocaleString("en-US")}
      </td>
    </tr>
  ));
  if (fixedHeaderLayout) {
    return (
      <>
        <ContentDetailsModal
          open={selectedArticle !== null}
          onClose={() => setSelectedArticle(null)}
          item={selectedArticle}
          onDeleteConfirm={() => {
            setSelectedArticle(null);
            setToastOpen(true);
          }}
        />
        <Toast
          open={toastOpen}
          message="Content deletion confirmed"
          onClose={() => setToastOpen(false)}
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-[#e0e4e9] bg-white shadow-[0_1px_0_0_#e0e4e9]">
            <table className="w-full table-fixed border-separate border-spacing-0">
              {COLGROUP}
              <thead>
                {headerRow}
              </thead>
            </table>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full table-fixed border-separate border-spacing-0">
              {COLGROUP}
              <tbody>{bodyRows}</tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ContentDetailsModal
        open={selectedArticle !== null}
        onClose={() => setSelectedArticle(null)}
        item={selectedArticle}
        onDeleteConfirm={() => {
          setSelectedArticle(null);
          setToastOpen(true);
        }}
      />
      <Toast
        open={toastOpen}
        message="Content deletion confirmed"
        onClose={() => setToastOpen(false)}
      />
      <div className="w-full overflow-x-hidden">
        <table className="w-full table-fixed border-separate border-spacing-0">
          {COLGROUP}
          <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_#e0e4e9]">
            {headerRow}
          </thead>
          <tbody>{bodyRows}</tbody>
        </table>
      </div>
    </>
  );
}
