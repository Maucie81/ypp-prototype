"use client";

import { Icon } from "@yahoo/uds";
import { Article, VideoCamera, ImageGallery } from "@yahoo/uds-icons";
import { PublishStatusLabel, type PublishStatusLabelVariant } from "@/components/PublishStatusLabel";
import type { SearchableContentItem } from "@/lib/mockData";
import type { SearchPhase } from "@/lib/useGlobalSearch";

function ContentTypeIcon({ type }: { type: string }) {
  const iconName =
    type === "video" ? VideoCamera : type === "slideshow" ? ImageGallery : Article;
  return (
    <Icon name={iconName} size="sm" variant="outline" className="size-4 shrink-0 text-[#232a31]" />
  );
}

function ResultRow({
  item,
  onSelect,
  revealIndex,
}: {
  item: SearchableContentItem;
  onSelect: (item: SearchableContentItem) => void;
  /** Position among search results, for the staggered entrance. Omit to skip the entrance. */
  revealIndex?: number;
}) {
  const thumbUrl = item.thumbnailUrl ?? `https://picsum.photos/seed/${item.thumbnailSeed}/163/104`;
  const reveals = revealIndex !== undefined;

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`flex w-full shrink-0 items-center gap-6 px-8 py-5 text-left transition-colors hover:bg-[#f5f8fa] ${
        reveals ? "search-result-in" : ""
      }`}
      // Only the rows on screen stagger; the rest would just add a wait when scrolled to.
      style={reveals ? { animationDelay: `${Math.min(revealIndex, 5) * 150}ms` } : undefined}
    >
      <div className="h-[104px] w-[163px] shrink-0 overflow-hidden rounded-[4px] bg-[#e0e4e9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbUrl} alt="" width={163} height={104} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <ContentTypeIcon type={item.contentType} />
          <p className="min-w-0 flex-1 truncate font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
            {item.title}
          </p>
        </div>
        <p className="line-clamp-2 font-yahoo-product-sans text-[12px] leading-4 text-[#464e56]">
          {item.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <PublishStatusLabel variant={item.status as PublishStatusLabelVariant} />
          <span className="font-yahoo-product-sans text-[12px] font-medium leading-4 text-[#464e56]">
            {item.provider}
          </span>
          <span className="font-yahoo-product-sans text-[12px] leading-4 text-[#464e56]">
            {item.publishedAt}
          </span>
        </div>
      </div>
    </button>
  );
}

function SkeletonRow({ index }: { index: number }) {
  return (
    <div
      className="search-skeleton-row flex w-full shrink-0 items-center gap-6 px-8 py-5"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="h-[104px] w-[163px] shrink-0 rounded-[4px] bg-[#e0e4e9]" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-[#e0e4e9] shrink-0" />
          <div className="h-4 w-2/3 rounded bg-[#e0e4e9]" />
        </div>
        <div className="h-3 w-full rounded bg-[#e0e4e9]" />
        <div className="h-3 w-4/5 rounded bg-[#e0e4e9]" />
        <div className="flex items-center gap-4">
          <div className="h-5 w-20 rounded-full bg-[#e0e4e9]" />
          <div className="h-3 w-16 rounded bg-[#e0e4e9]" />
          <div className="h-3 w-16 rounded bg-[#e0e4e9]" />
        </div>
      </div>
    </div>
  );
}

/** Enough rows to reach the panel's max height, so it doesn't resize when results replace them. */
function SkeletonRows() {
  return (
    <div className="min-h-0 flex-1 divide-y divide-[#f5f5f5] overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} index={i} />)}
    </div>
  );
}

export function GlobalSearchDropdown({
  phase,
  items,
  onSelectItem,
  shown = true,
}: {
  phase: SearchPhase;
  items: SearchableContentItem[];
  onSelectItem: (item: SearchableContentItem) => void;
  /** Drives the entrance/exit transition — lets the panel animate in after the field has expanded. */
  shown?: boolean;
}) {
  const title =
    phase === "searching" ? "Searching…" : phase === "results" ? "Search results" : "Recently published";

  return (
    <div
      className={`absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-[8px] bg-white transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? "translate-y-0 opacity-100 duration-[240ms]" : "-translate-y-2 opacity-0 duration-[160ms]"
      }`}
      style={{ boxShadow: "0px 2px 4px rgba(0,0,0,0.08), 0px 0px 1px rgba(0,0,0,0.1)" }}
    >
      {/* Sticky title bar */}
      <div className="flex shrink-0 items-center border-b border-[#f5f5f5] px-5 pb-3 pt-6">
        <p className="flex-1 font-yahoo-product-sans text-[16px] font-medium leading-5 tracking-[0.16px] text-[#232a31]">
          {title}
        </p>
      </div>

      {/* Body */}
      {phase === "searching" ? (
        <SkeletonRows />
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 py-24">
          <p className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
            No results found
          </p>
          <p className="font-yahoo-product-sans text-[13px] leading-5 text-[#6e7780]">
            Try a different title, UUID, or content type.
          </p>
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {items.map((item, i) => (
              <ResultRow
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                revealIndex={phase === "results" ? i : undefined}
              />
            ))}
          </div>
          {phase === "results" && (
            <div className="search-skeleton-out pointer-events-none absolute inset-0 overflow-hidden bg-white" aria-hidden>
              <SkeletonRows />
            </div>
          )}
        </div>
      )}

    </div>
  );
}
