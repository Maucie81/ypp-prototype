"use client";

import Link from "next/link";
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
}: {
  item: SearchableContentItem;
  onSelect: (item: SearchableContentItem) => void;
}) {
  const thumbUrl = `https://picsum.photos/seed/${item.thumbnailSeed}/163/104`;

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="flex w-full shrink-0 items-center gap-6 px-8 py-5 text-left transition-colors hover:bg-[#f5f8fa]"
    >
      <div className="h-[104px] w-[163px] shrink-0 overflow-hidden rounded-[4px] bg-[#e0e4e9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbUrl} alt="" width={163} height={104} className="h-full w-full object-cover" />
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

function Spinner() {
  return (
    <div
      className="size-10 shrink-0 animate-spin rounded-full border-[3px] border-[#e0e4e9] border-t-[#7d2eff]"
      aria-hidden
    />
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
        <div className="flex flex-1 items-center justify-center py-24">
          <Spinner />
        </div>
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
        <div className="flex-1 overflow-y-auto">
          {items.map((item) => (
            <ResultRow key={item.id} item={item} onSelect={onSelectItem} />
          ))}
        </div>
      )}

      {/* View all footer — only for the recently-published (empty query) state */}
      {phase === "recent" && (
        <Link
          href="/kpi/top-content"
          className="flex shrink-0 items-center justify-center border-t border-[#f5f5f5] py-3 font-yahoo-product-sans text-[14px] font-medium text-[#7d2eff] transition-colors hover:bg-[#f5f8fa]"
        >
          View all content
        </Link>
      )}
    </div>
  );
}
