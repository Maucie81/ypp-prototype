"use client";

import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { Icon } from "@yahoo/uds";
import { Article, VideoCamera, ImageGallery, Cross, Download } from "@yahoo/uds-icons";
import { Modal } from "@/components/ui/Modal";
import { DeleteContentDialog } from "@/components/DeleteContentDialog";
import { PublishStatusLabel, type PublishStatusLabelVariant } from "@/components/PublishStatusLabel";
import {
  getContentMetadata,
  type ContentModalItem,
  type ContentPerfTab,
} from "@/lib/mockData";

// ── Helpers ──────────────────────────────────────────────────────────────────

function contentTypeLabel(type: string): string {
  if (type === "video") return "Video";
  if (type === "slideshow") return "Slideshow";
  return "Article";
}

function ContentTypeIcon({ type }: { type: string }) {
  const iconName =
    type === "video" ? VideoCamera : type === "slideshow" ? ImageGallery : Article;
  return (
    <Icon
      name={iconName}
      size="sm"
      variant="outline"
      className="size-5 shrink-0 text-[#232a31]"
    />
  );
}

function statusToVariant(status: string | undefined): PublishStatusLabelVariant {
  if (status === "Published with warning" || status === "Published with warnings")
    return "Published with warnings";
  if (status === "Not published" || status === "Failed to publish") return "Failed to publish";
  return "Published";
}

// ── Performance chart tabs ────────────────────────────────────────────────────

const PERF_TABS: ContentPerfTab[] = [
  "Views", "Uniques", "Reach", "CTR", "Dwell", "Comments",
];

// ── Card (rendered inside the modal) ─────────────────────────────────────────

function ModalCard({
  item,
  onClose,
  onDeleteConfirm,
}: {
  item: ContentModalItem;
  onClose: () => void;
  onDeleteConfirm: (item: ContentModalItem, reason: string) => void;
}) {
  const meta = getContentMetadata(item.id);
  const [activeTab, setActiveTab] = useState<ContentPerfTab>("Views");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const thumbUrl = `https://picsum.photos/seed/${item.thumbnailSeed}/163/104`;

  const chartOption = {
    animation: false,
    grid: { left: 48, right: 12, top: 16, bottom: 32 },
    xAxis: {
      type: "category",
      data: meta.chartDates,
      boundaryGap: false,
      axisTick: { show: true, alignWithLabel: true, lineStyle: { color: "#f0f3f5" }, length: 4 },
      axisLine: { show: true, lineStyle: { color: "#f0f3f5" } },
      axisLabel: {
        color: "#6e7780",
        fontSize: 12,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
        margin: 10,
      },
      splitLine: { show: true, lineStyle: { color: "#f0f3f5", width: 1 } },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      interval: 20,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#6e7780",
        fontSize: 12,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
      },
      splitLine: { show: true, lineStyle: { color: "#f0f3f5", width: 1 } },
    },
    series: [
      {
        type: "line",
        data: meta.chartSeries[activeTab],
        smooth: false,
        showSymbol: true,
        symbolSize: 5,
        symbol: "circle",
        lineStyle: { color: "#B9B9B9", width: 1.5 },
        itemStyle: { color: "#484848" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(185,185,185,0.24)" },
              { offset: 0.5, color: "rgba(185,185,185,0.10)" },
              { offset: 1, color: "rgba(185,185,185,0.03)" },
            ],
            global: false,
          },
        },
        emphasis: {
          showSymbol: true,
          symbolSize: 6,
          itemStyle: {
            color: "#7d2eff",
            borderColor: "rgba(125,46,255,0.28)",
            borderWidth: 10,
          },
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      backgroundColor: "#232a31",
      borderColor: "#232a31",
      borderWidth: 0,
      padding: [6, 10],
      textStyle: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
      },
    },
  };

  const metaFields = [
    { label: "Partner URL", value: meta.partnerUrl, href: meta.partnerUrl },
    { label: "Yahoo URL", value: meta.yahooUrl, href: meta.yahooUrl },
    { label: "Source feed", value: meta.sourceFeed },
    { label: "GUID", value: meta.guid },
    { label: "Document ID", value: meta.documentId },
  ];

  return (
    <div
      className="flex max-h-[90vh] flex-col overflow-hidden rounded-[16px] bg-white"
      style={{
        boxShadow:
          "0px 0px 16px rgba(0,0,0,0.05), 0px 32px 32px -20px rgba(0,0,0,0.4)",
      }}
    >
      {/* ── Sticky header ── */}
      <div className="flex shrink-0 items-center justify-between gap-6 rounded-t-[16px] bg-white px-10 pt-7 pb-6">
        <div className="flex items-center gap-2">
          <ContentTypeIcon type={item.contentType} />
          <h2 className="font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#232a31]">
            {contentTypeLabel(item.contentType)} details
          </h2>
        </div>
        <button
          onClick={onClose}
          className="flex size-[44px] shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#f0f3f5]"
          aria-label="Close"
        >
          <Icon name={Cross} size="sm" variant="outline" className="size-5 text-[#464e56]" />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-10 pb-8 pt-0">
        {/* Content card */}
        <div className="rounded-[8px] bg-[#f5f5f5] px-6 py-6">
          {/* Thumbnail + story details row */}
          <div className="flex gap-6">
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

            {/* Story details + Delete button */}
            <div className="flex min-w-0 flex-1 items-start gap-4">
              {/* Text details */}
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="line-clamp-1 font-yahoo-product-sans text-[16px] font-semibold leading-5 text-[#232a31]">
                  {item.title}
                </p>
                <p className="line-clamp-2 font-yahoo-product-sans text-[14px] leading-5 text-[#6e7780]">
                  {item.snippet}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <PublishStatusLabel variant={statusToVariant(item.status)} />
                  <span className="font-yahoo-product-sans text-[12px] text-[#464e56]">
                    {item.publishedAt}
                  </span>
                </div>
              </div>
              {/* Delete button — right side */}
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="shrink-0 rounded-full border border-[#e0e4e9] bg-white px-5 py-2 font-yahoo-product-sans text-[14px] font-medium text-[#232a31] transition-colors hover:bg-[#f5f8fa]"
              >
                Delete {contentTypeLabel(item.contentType).toLowerCase()}
              </button>
            </div>
          </div>

        </div>

        {/* Filter chips and metadata row */}
        <div className="flex items-center justify-between gap-6">
          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[#2c363f] bg-[#f5f8fa] px-4 py-2 font-yahoo-product-sans text-[14px] font-medium text-[#232a31]">
              Last 7 days ×
            </span>
            {["Regions", "Devices"].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-[#e0e4e9] bg-white px-4 py-2 font-yahoo-product-sans text-[14px] text-[#232a31]"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Metadata row — right-aligned */}
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1.5">
          {metaFields.map((field, i) => (
            <span key={field.label} className="flex items-center gap-4">
              <span className="font-yahoo-product-sans text-[14px] text-[#464e56]">
                {field.href ? (
                  <a
                    href={field.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7d2eff] underline"
                  >
                    {field.label}
                  </a>
                ) : (
                  <span className="group relative cursor-default">
                    <span className="border-b border-dashed border-[#6e7780]">
                      {field.label}
                    </span>
                    {/* Tooltip */}
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#232a31] px-2.5 py-1.5 font-yahoo-product-sans text-[12px] leading-4 text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                      {field.value}
                      {/* Arrow */}
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#232a31]" />
                    </span>
                  </span>
                )}
              </span>
              {i < metaFields.length - 1 && (
                <span className="text-[#c8cdd2]" aria-hidden>|</span>
              )}
            </span>
          ))}
          </div>
        </div>

        {/* Performance chart — no border, white rounded container */}
        <div className="rounded-[10px] bg-white pb-2 pt-3">
          {/* Tab bar + download */}
          <div className="flex items-center gap-6 px-3">
            <div className="flex flex-1 items-center gap-6 overflow-x-auto">
              {PERF_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 py-3 font-yahoo-product-sans text-[14px] transition-colors ${
                    activeTab === tab
                      ? "border-b-4 border-[#7d2eff]"
                      : "hover:opacity-70"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      activeTab === tab ? "text-[#232a31]" : "text-[#464e56]"
                    }`}
                  >
                    {tab}:{" "}
                  </span>
                  <span className="font-normal text-[#6e7780]">
                    {meta.tabTotals[tab]}
                  </span>
                </button>
              ))}
            </div>
            <button className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e0e4e9] bg-white transition-colors hover:bg-[#f5f8fa]">
              <Icon name={Download} size="sm" variant="outline" className="size-4 text-[#6a6a6a]" />
            </button>
          </div>

          {/* Line chart */}
          <ReactECharts
            key={activeTab}
            option={chartOption}
            style={{ height: 280, width: "100%" }}
            opts={{ renderer: "canvas" }}
            notMerge
          />
        </div>
      </div>

      <DeleteContentDialog
        open={deleteDialogOpen}
        contentTypeLabel={contentTypeLabel(item.contentType).toLowerCase()}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={(reason) => {
          setDeleteDialogOpen(false);
          onDeleteConfirm(item, reason);
        }}
      />
    </div>
  );
}

// ── Exported modal ────────────────────────────────────────────────────────────

export function ContentDetailsModal({
  open,
  onClose,
  item,
  onDeleteConfirm,
}: {
  open: boolean;
  onClose: () => void;
  item: ContentModalItem | null;
  onDeleteConfirm?: (item: ContentModalItem, reason: string) => void;
}) {
  return (
    <Modal open={open && item !== null} onClose={onClose} className="max-w-[min(1312px,calc(100vw-80px))]">
      {item && (
        <ModalCard
          item={item}
          onClose={onClose}
          onDeleteConfirm={(deletedItem, reason) => {
            onClose();
            onDeleteConfirm?.(deletedItem, reason);
          }}
        />
      )}
    </Modal>
  );
}
