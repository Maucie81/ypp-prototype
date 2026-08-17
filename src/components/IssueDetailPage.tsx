"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Icon } from "@yahoo/uds";
import { Article, VideoCamera, ImageGallery } from "@yahoo/uds-icons";
import { FilterChip } from "@/components/FilterChip";
import { DateFilter, type DateFilterValue } from "@/components/filters/DateFilter";
import { PublishStatusLabel, type PublishStatusLabelVariant } from "@/components/PublishStatusLabel";
import { DownloadButton } from "@/components/DownloadButton";
import { TablePagination } from "@/components/TablePagination";
import { ContentDetailsModal } from "@/components/ContentDetailsModal";
import { WarningIssueModal } from "@/components/WarningIssueModal";
import { FailureIssueModal } from "@/components/FailureIssueModal";
import { useTimeFilter } from "@/contexts/TimeFilterContext";
import {
  getIssueDetailData,
  getIssueContentItems,
  type IssueContentItem,
  type ContentModalItem,
  type FeedContentType,
  type DateRangePreset,
} from "@/lib/mockData";

// ─── Date chip label helper ───────────────────────────────────────────────────

function dateChipLabel(value: DateFilterValue): string {
  if (value.mode === "preset") {
    switch (value.preset) {
      case "last30":  return "Last 30 days";
      case "last14":  return "Last 14 days";
      case "last7":   return "Last 7 days";
      case "last24h": return "Last 24 hours";
      case "mtd":     return "Month to date";
    }
  }
  return `${value.startISO} – ${value.endISO}`;
}

// ─── Issue trend bar chart ────────────────────────────────────────────────────

function IssueTrendChart({ bars, dates }: { bars: number[]; dates: string[] }) {
  const option = {
    animation: false,
    grid: { left: 44, right: 8, top: 8, bottom: 32 },
    xAxis: {
      type: "category",
      data: dates,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#6e7780",
        fontSize: 12,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
        interval: dates.length > 14 ? Math.floor(dates.length / 8) : 0,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      interval: 20,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#6e7780",
        fontSize: 12,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
      },
      splitLine: { show: true, lineStyle: { color: "#f0f3f5" } },
    },
    series: [
      {
        type: "bar",
        data: bars,
        barMaxWidth: 40,
        itemStyle: { color: "#36ad84", borderRadius: [4, 4, 0, 0] },
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#fff",
      borderColor: "#e0e4e9",
      borderWidth: 1,
      textStyle: {
        color: "#232a31",
        fontSize: 12,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
      },
      padding: 10,
    },
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 280, width: "100%" }}
      opts={{ renderer: "canvas" }}
      notMerge
    />
  );
}

// ─── Content type icon ────────────────────────────────────────────────────────

function ContentTypeIcon({ type }: { type: FeedContentType }) {
  const iconName =
    type === "video" ? VideoCamera : type === "slideshow" ? ImageGallery : Article;
  return (
    <Icon
      name={iconName}
      size="xs"
      variant="outline"
      className="size-4 shrink-0 text-[#464e56]"
    />
  );
}

// ─── Single content item row ──────────────────────────────────────────────────

function IssueContentRow({
  item,
  badgeVariant,
  onRowClick,
  onBadgeClick,
}: {
  item: IssueContentItem;
  badgeVariant: PublishStatusLabelVariant;
  onRowClick?: (item: IssueContentItem) => void;
  onBadgeClick?: (item: IssueContentItem) => void;
}) {
  const thumbUrl = `https://picsum.photos/seed/${item.thumbnailSeed}/163/104`;
  return (
    <div
      className={`flex items-center gap-6 border-b border-[#f0f3f5] py-5 last:border-b-0 ${
        onRowClick
          ? "cursor-pointer rounded-[4px] px-1 -mx-1 transition-colors hover:bg-[#f5f8fa]"
          : ""
      }`}
      onClick={() => onRowClick?.(item)}
    >
      {/* Thumbnail */}
      <div className="h-[104px] w-[163px] shrink-0 overflow-hidden rounded-[4px] bg-[#e0e4e9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbUrl}
          alt=""
          width={163}
          height={104}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <ContentTypeIcon type={item.contentType} />
          <p className="min-w-0 flex-1 truncate font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
            {item.title}
          </p>
        </div>
        <p className="line-clamp-1 font-yahoo-product-sans text-[12px] font-normal leading-4 text-[#464e56]">
          {item.description}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onBadgeClick?.(item);
            }}
          >
            <PublishStatusLabel variant={badgeVariant} />
          </span>
          <span className="font-yahoo-product-sans text-[12px] font-normal leading-4 text-[#6e7780]">
            {item.publishedAt}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Shared issue detail page ─────────────────────────────────────────────────

export function IssueDetailPage({
  issueId,
  type,
}: {
  issueId: string;
  type: "warning" | "failure";
}) {
  const { range, dateValue, setDateValue } = useTimeFilter();
  const rangePreset: DateRangePreset = range;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateOpen, setDateOpen] = useState(false);

  // ── Modal state ──
  const [contentModal, setContentModal] = useState<ContentModalItem | null>(null);
  const [warnModal, setWarnModal] = useState<ContentModalItem | null>(null);
  const [failModal, setFailModal] = useState<ContentModalItem | null>(null);

  const issueType =
    type === "warning" ? "published_with_warning" : "not_published";

  const detail = useMemo(
    () => getIssueDetailData(issueId, issueType, rangePreset),
    [issueId, issueType, rangePreset],
  );
  const allItems = useMemo(
    () => getIssueContentItems(issueId, rangePreset),
    [issueId, rangePreset],
  );

  const start = (page - 1) * pageSize;
  const visibleItems = allItems.slice(start, start + pageSize);

  // Warning page: "Feed Health > Publishing vitals"
  // Failure page: "Publishing vitals" only
  const breadcrumbs =
    type === "warning"
      ? [
          { label: "Feed Health", href: "/feed-health" },
          { label: "Publishing vitals", href: "/feed-health" },
        ]
      : [{ label: "Publishing vitals", href: "/feed-health" }];

  const badgeVariant: PublishStatusLabelVariant =
    type === "warning" ? "Published with warning" : "Not published";

  const contentBadgeVariant: PublishStatusLabelVariant =
    type === "warning" ? "Published with warnings" : "Failed to publish";

  const sectionTitle =
    type === "warning" ? "All content with warnings" : "All content not published";

  return (
    <>
    <div className="flex flex-col gap-6">
      {/* ── Sticky page header ── */}
      <div className="sticky top-0 z-10 flex flex-col bg-white" style={{ backgroundColor: "#ffffff" }}>
        <div className="flex flex-col gap-4 bg-white py-6" style={{ backgroundColor: "#ffffff" }}>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-0 font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]"
            >
              {breadcrumbs.map((item, i) => (
                <span key={i} className="flex items-center">
                  {i > 0 && <span className="px-2.5 font-normal">&gt;</span>}
                  {item.href ? (
                    <Link href={item.href} className="hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Badge + title on the same row, badge LEFT of title */}
          <div className="flex items-center gap-3">
            <PublishStatusLabel variant={badgeVariant} />
            <h1 className="font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#232a31]">
              {detail.name}
            </h1>
          </div>
        </div>

        {/* Date filter chip — only the date/time picker */}
        <div className="flex flex-wrap items-center gap-4 bg-white pb-4" style={{ backgroundColor: "#ffffff" }}>
          <DateFilter
            open={dateOpen}
            onOpenChange={setDateOpen}
            value={dateValue}
            onChange={(next) => {
              setDateValue(next);
              setPage(1);
            }}
            trigger={
              <FilterChip
                label={dateChipLabel(dateValue)}
                variant="applied"
                isOpen={dateOpen}
                onClick={() => setDateOpen((o) => !o)}
                onClear={() => {
                  setDateValue({ mode: "preset", preset: "last7" });
                  setDateOpen(false);
                  setPage(1);
                }}
              />
            }
          />
        </div>
      </div>

      {/* Description + metadata */}
      <div className="flex flex-col gap-3">
        <p className="font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#464e56]">
          {detail.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#464e56]">
          <span>
            Content volume:{" "}
            <strong className="font-medium text-[#232a31]">
              {detail.contentVolume.toLocaleString("en-US")}
            </strong>
          </span>
          <span className="text-[#c8cdd2]">|</span>
          <span>
            Last discovered:{" "}
            <strong className="font-medium text-[#232a31]">
              {detail.lastDiscovered}
            </strong>
          </span>
        </div>
      </div>

      {/* Issue trend */}
      <section className="rounded-[16px] border border-[#e0e4e9] bg-white px-6 py-5">
        <header className="flex items-center justify-between gap-4">
          <h2 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
            Issue trend
          </h2>
          <DownloadButton />
        </header>
        <div className="mt-4">
          <IssueTrendChart bars={detail.trendBars} dates={detail.trendDates} />
        </div>
      </section>

      {/* Content list */}
      <section className="rounded-[16px] border border-[#e0e4e9] bg-white pt-6">
        <header className="flex items-center justify-between gap-4 px-6 pb-2">
          <h2 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
            {sectionTitle}
          </h2>
          <DownloadButton />
        </header>

        <div className="px-6">
          {visibleItems.map((item) => (
            <IssueContentRow
              key={item.id}
              item={item}
              badgeVariant={contentBadgeVariant}
              onRowClick={(i) => setContentModal({ ...i, snippet: i.description })}
              onBadgeClick={(i) => {
                const modalItem = { ...i, snippet: i.description };
                if (type === "warning") setWarnModal(modalItem);
                else setFailModal(modalItem);
              }}
            />
          ))}
        </div>

        <div className="border-t border-[#e3e3e3] px-8 pb-4">
          <TablePagination
            totalRows={allItems.length}
            pageSize={pageSize}
            currentPage={page}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
            onPageChange={setPage}
            embedded
          />
        </div>
      </section>
    </div>

      {/* ── Modals ── */}
      <ContentDetailsModal
        open={contentModal !== null}
        onClose={() => setContentModal(null)}
        item={contentModal}
      />
      <WarningIssueModal
        open={warnModal !== null}
        onClose={() => setWarnModal(null)}
        item={warnModal}
      />
      <FailureIssueModal
        open={failModal !== null}
        onClose={() => setFailModal(null)}
        item={failModal}
      />
    </>
  );
}
