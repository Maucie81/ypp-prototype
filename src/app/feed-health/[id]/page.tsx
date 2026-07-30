"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import ReactECharts from "echarts-for-react";
import { Icon } from "@yahoo/uds";
import { Article, VideoCamera, ImageGallery, ChevronRight } from "@yahoo/uds-icons";
import { PageHeader } from "@/components/PageHeader";
import { FilterBar } from "@/components/filters/FilterBar";
import { KpiCard } from "@/components/KpiCard";
import { PublishStatusLabel } from "@/components/PublishStatusLabel";
import { DownloadButton } from "@/components/DownloadButton";
import { KpiSparkline } from "@/components/KpiSparkline";
import { TablePagination } from "@/components/TablePagination";
import { ContentDetailsModal } from "@/components/ContentDetailsModal";
import { WarningIssueModal } from "@/components/WarningIssueModal";
import { FailureIssueModal } from "@/components/FailureIssueModal";
import { useTimeFilter } from "@/contexts/TimeFilterContext";
import {
  getFeedVitalsRowById,
  getFeedDetailKpis,
  getFeedHeatMapData,
  getIssuesDetected,
  getFeedRecentItems,
  getSampleContentItem,
  type DateRangePreset,
  type IssueSummaryRow,
  type FeedRecentItem,
  type FeedContentType,
  type ContentModalItem,
} from "@/lib/mockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function feedDisplayName(name: string): string {
  return name.replace(/\s*·\s*(Video|Article|Slideshow)\s*·\s*/gi, " · ").trim();
}

// ─── Feed reliability heat map ────────────────────────────────────────────────

function FeedReliabilityHeatMap({ feedId, range }: { feedId: string; range?: DateRangePreset }) {
  const { dates, cells } = useMemo(() => getFeedHeatMapData(feedId, range), [feedId, range]);
  // Y axis: hours 0–23, shown as category strings
  const hours = Array.from({ length: 24 }, (_, i) => String(i));

  // Build full cell matrix: value 0=ok, 1=delayed, 2=error
  // Map delayed/error cells by [date, hour] for fast lookup
  const cellMap = new Map<string, 0 | 1 | 2>();
  for (const c of cells) {
    cellMap.set(`${c.dateIdx},${c.hour}`, c.status);
  }
  // All cells using category string values (required for ECharts heatmap)
  const allCellData = dates.flatMap((date, d) =>
    hours.map((hour, h) => [date, hour, cellMap.get(`${d},${h}`) ?? 0])
  );

  const option = {
    animation: false,
    grid: { top: 8, right: 16, bottom: 40, left: 54 },
    xAxis: {
      type: "category",
      data: dates,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#6e7780",
        fontSize: 12,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
        margin: 10,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: "category",
      data: hours,
      name: "Hour of day",
      nameLocation: "middle",
      nameGap: 44,
      nameTextStyle: {
        color: "#6e7780",
        fontSize: 12,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
      },
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#6e7780",
        fontSize: 11,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
        interval: 1,
        formatter: (v: string) => (Number(v) % 2 === 0 ? v : ""),
      },
      splitLine: { show: false },
    },
    visualMap: {
      show: false,
      type: "piecewise",
      pieces: [
        { value: 0, color: "#f0f3f5" },
        { value: 1, color: "#ecc628" },
        { value: 2, color: "#fd6a74" },
      ],
    },
    series: [
      {
        type: "heatmap",
        data: allCellData,
        itemStyle: { borderColor: "#fff", borderWidth: 2, borderRadius: 3 },
        emphasis: {
          itemStyle: { opacity: 0.85 },
        },
      },
    ],
    tooltip: {
      show: true,
      formatter: (params: { data: [string, string, number] }) => {
        if (!Array.isArray(params.data)) return "";
        const [date, hour, status] = params.data;
        if (status === 0) return "";
        const label = status === 2 ? "Error" : "Delayed";
        return `${date} · ${hour}:00 — <strong>${label}</strong>`;
      },
      backgroundColor: "#fff",
      borderColor: "#e0e4e9",
      borderWidth: 1,
      textStyle: { color: "#232a31", fontSize: 12, fontFamily: "Yahoo_Product_Sans_VF, sans-serif" },
      padding: 10,
    },
  };

  return (
    <section className="rounded-[16px] border border-[#e0e4e9] bg-white px-6 py-5">
      <header className="flex items-center justify-between gap-4">
        <h2 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
          Feed reliability
        </h2>
        <DownloadButton />
      </header>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5">
        <LegendSwatch color="#f0f3f5" label="Successful" />
        <LegendSwatch color="#ecc628" label="Delayed" striped />
        <LegendSwatch color="#fd6a74" label="Error" />
      </div>

      <div className="mt-2">
        <ReactECharts
          option={option}
          style={{ height: 340, width: "100%" }}
          opts={{ renderer: "canvas" }}
          notMerge
        />
      </div>
    </section>
  );
}

function LegendSwatch({ color, label, striped }: { color: string; label: string; striped?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {striped ? (
        <svg width="16" height="16" aria-hidden className="shrink-0 rounded-[2px]">
          <rect width="16" height="16" fill="#ecc628" />
          <line x1="0" y1="5" x2="5" y2="0" stroke="#fff" strokeWidth="1.5" />
          <line x1="0" y1="11" x2="11" y2="0" stroke="#fff" strokeWidth="1.5" />
          <line x1="5" y1="16" x2="16" y2="5" stroke="#fff" strokeWidth="1.5" />
          <line x1="11" y1="16" x2="16" y2="11" stroke="#fff" strokeWidth="1.5" />
        </svg>
      ) : (
        <span className="size-4 rounded-[2px] shrink-0" style={{ backgroundColor: color }} aria-hidden />
      )}
      <span className="font-yahoo-product-sans text-[13px] font-normal leading-5 text-[#464e56]">
        {label}
      </span>
    </div>
  );
}

// ─── Issues detected table ────────────────────────────────────────────────────

const ISSUES_HEADER =
  "whitespace-nowrap border-b border-[#e3e3e3] py-2.5 font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31] px-4 first:pl-8 last:pr-8";
const ISSUES_CELL =
  "border-b border-[#e3e3e3] py-[14px] font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] px-4 first:pl-8 last:pr-8";

function IssuesTable({
  rows,
  onBadgeClick,
}: {
  rows: IssueSummaryRow[];
  onBadgeClick?: (row: IssueSummaryRow) => void;
}) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <colgroup>
          <col style={{ width: "29%" }} />
          <col style={{ width: "24%" }} />
          <col style={{ width: "27%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr>
            <th className={`${ISSUES_HEADER} text-left`}>Issue</th>
            <th className={`${ISSUES_HEADER} text-left`}>
              <span className="inline-flex items-center gap-1">
                Type
                <Icon name={ChevronRight} size="xs" variant="outline" className="size-3 rotate-90 text-[#6e7780]" />
              </span>
            </th>
            <th className={`${ISSUES_HEADER} text-center`}>Trend</th>
            <th className={`${ISSUES_HEADER} text-right`}>
              <span className="inline-flex items-center justify-end gap-1">
                Volume
                <Icon name={ChevronRight} size="xs" variant="outline" className="size-3 rotate-90 text-[#6e7780]" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="min-h-[56px] cursor-pointer hover:bg-[#f5f8fa]"
              onClick={() =>
                router.push(
                  `/feed-health/issues/${row.id}/${
                    row.type === "published_with_warning" ? "warning" : "failure"
                  }`,
                )
              }
            >
              <td className={`${ISSUES_CELL} text-left`}>
                <span className="line-clamp-1">{row.issue}</span>
              </td>
              <td className={`${ISSUES_CELL} text-left`}>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onBadgeClick?.(row);
                  }}
                >
                  <PublishStatusLabel
                    variant={
                      row.type === "published_with_warning"
                        ? "Published with warning"
                        : "Not published"
                    }
                  />
                </span>
              </td>
              <td className={`${ISSUES_CELL} text-center`}>
                <div className="mx-auto h-5 w-full max-w-[120px]">
                  <KpiSparkline
                    data={row.trend}
                    height={20}
                    lineColor={row.type === "published_with_warning" ? "#e26900" : "#d30d2e"}
                    dotRadius={0}
                  />
                </div>
              </td>
              <td className={`${ISSUES_CELL} text-right tabular-nums`}>
                {row.volume.toLocaleString("en-US")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

// ─── Recent items list ────────────────────────────────────────────────────────

function statusToVariant(status: FeedRecentItem["status"]) {
  if (status === "Published with warning") return "Published with warning" as const;
  if (status === "Not published") return "Not published" as const;
  return "Published" as const;
}

function RecentItemRow({
  item,
  onRowClick,
  onBadgeClick,
}: {
  item: FeedRecentItem;
  onRowClick?: (item: FeedRecentItem) => void;
  onBadgeClick?: (item: FeedRecentItem) => void;
}) {
  const thumbUrl = `https://picsum.photos/seed/${item.thumbnailSeed}/163/104`;
  return (
    <div
      className={`flex items-center gap-6 border-b border-[#f0f3f5] py-5 last:border-b-0 ${
        onRowClick ? "cursor-pointer rounded-[4px] hover:bg-[#f5f8fa] px-1 -mx-1 transition-colors" : ""
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
        {/* Headline row */}
        <div className="flex items-center gap-2">
          <ContentTypeIcon type={item.contentType} />
          <p className="min-w-0 flex-1 truncate font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
            {item.title}
          </p>
        </div>

        {/* Description */}
        <p className="line-clamp-1 font-yahoo-product-sans text-[12px] font-normal leading-4 text-[#464e56]">
          {item.description}
        </p>

        {/* Status + timestamp */}
        <div className="flex flex-wrap items-center gap-4">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onBadgeClick?.(item);
            }}
          >
            <PublishStatusLabel variant={statusToVariant(item.status)} />
          </span>
          <span className="font-yahoo-product-sans text-[12px] font-normal leading-4 text-[#6e7780]">
            {item.publishedAt}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeedHealthDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { range } = useTimeFilter();
  const rangePreset: DateRangePreset = range;

  const [issuePage, setIssuePage] = useState(1);
  const [issuePageSize, setIssuePageSize] = useState(10);
  const [recentPage, setRecentPage] = useState(1);
  const [recentPageSize, setRecentPageSize] = useState(10);

  // ── Modal state ──
  const [contentModal, setContentModal] = useState<ContentModalItem | null>(null);
  const [warnModal, setWarnModal] = useState<ContentModalItem | null>(null);
  const [failModal, setFailModal] = useState<ContentModalItem | null>(null);

  function openContentModal(item: ContentModalItem) {
    setContentModal(item);
  }
  function openIssueModal(item: ContentModalItem, type: "warning" | "failure") {
    if (type === "warning") setWarnModal(item);
    else setFailModal(item);
  }

  const feed = useMemo(() => getFeedVitalsRowById(id, rangePreset), [id, rangePreset]);
  const kpis = useMemo(() => getFeedDetailKpis(id, rangePreset), [id, rangePreset]);
  const allIssues = useMemo(() => getIssuesDetected(rangePreset), [rangePreset]);
  const allRecent = useMemo(() => getFeedRecentItems(id, rangePreset), [id, rangePreset]);

  if (!feed) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-[#6e7780]">
        Loading…
      </div>
    );
  }

  const displayName = feedDisplayName(feed.name);

  const issueStart = (issuePage - 1) * issuePageSize;
  const visibleIssues = allIssues.slice(issueStart, issueStart + issuePageSize);

  const recentStart = (recentPage - 1) * recentPageSize;
  const visibleRecent = allRecent.slice(recentStart, recentStart + recentPageSize);

  return (
    <>
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <PageHeader
        breadcrumbs={[
          { label: "Feed health", href: "/feed-health" },
          { label: `${displayName} details` },
        ]}
        title={`${displayName} details`}
        slotClassName="pb-0"
      >
        <div className="flex w-full flex-col gap-3">
          {/* Feed metadata links */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-yahoo-product-sans text-[13px] leading-5 text-[#464e56]">
            <span>Source ID: {feed.id}</span>
            <span className="text-[#c8cdd2]" aria-hidden>|</span>
            <a href="#" className="font-medium text-[#7d2eff] underline hover:text-[#6b1fe8]">Feed source URL</a>
            <span className="text-[#c8cdd2]" aria-hidden>|</span>
            <span>Partner brand: {feed.brand}</span>
          </div>
          <section aria-label="Filters" className="w-full">
            <FilterBar variant="overview" />
          </section>
        </div>
      </PageHeader>

      {/* KPI metrics — 2 rows × 3 columns matching Figma Secondary Chip_Small */}
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Feed metrics"
      >
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            variant="secondary"
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            helperText={kpi.helperText}
          />
        ))}
      </section>

      {/* Feed reliability heat map */}
      <FeedReliabilityHeatMap feedId={id} range={rangePreset} />

      {/* Issues detected */}
      <section className="rounded-[16px] border border-[#e0e4e9] bg-white pt-6">
        <header className="flex items-center justify-between gap-4 px-6 pb-5">
          <h2 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
            Issues detected
          </h2>
          <DownloadButton />
        </header>

        <IssuesTable
          rows={visibleIssues}
          onBadgeClick={(row) =>
            openIssueModal(
              getSampleContentItem(row.id),
              row.type === "published_with_warning" ? "warning" : "failure",
            )
          }
        />

        <div className="px-8 pb-4">
          <TablePagination
            totalRows={allIssues.length}
            pageSize={issuePageSize}
            currentPage={issuePage}
            onPageSizeChange={(size) => { setIssuePageSize(size); setIssuePage(1); }}
            onPageChange={setIssuePage}
            embedded
          />
        </div>
      </section>

      {/* Most recent items */}
      <section className="rounded-[16px] border border-[#e0e4e9] bg-white pt-6">
        <header className="flex items-center justify-between gap-4 px-6 pb-2">
          <h2 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
            Most recent items
          </h2>
          <DownloadButton />
        </header>

        <div className="px-6">
          {visibleRecent.map((item) => (
            <RecentItemRow
              key={item.id}
              item={item}
              onRowClick={(i) => openContentModal(i)}
              onBadgeClick={(i) => {
                const type =
                  i.status === "Published with warning" ? "warning" : "failure";
                openIssueModal(i, type);
              }}
            />
          ))}
        </div>

        <div className="border-t border-[#e3e3e3] px-8 pb-4">
          <TablePagination
            totalRows={allRecent.length}
            pageSize={recentPageSize}
            currentPage={recentPage}
            onPageSizeChange={(size) => { setRecentPageSize(size); setRecentPage(1); }}
            onPageChange={setRecentPage}
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
