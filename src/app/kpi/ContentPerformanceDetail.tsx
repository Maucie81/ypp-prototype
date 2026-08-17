"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@yahoo/uds";
import { Article } from "@yahoo/uds-icons";
import { DownloadButton } from "@/components/DownloadButton";
import { PageHeader } from "@/components/PageHeader";
import { TablePagination } from "@/components/TablePagination";
import { FilterBar } from "@/components/filters/FilterBar";
import { ContentPerformanceChart } from "@/components/ContentPerformanceChart";
import { useTimeFilter } from "@/contexts/TimeFilterContext";
import {
  getContentPerformanceMetricData,
  getContentPerformanceTableByDimension,
  type ContentMetricTab,
  type ContentPerformanceTableDimension,
} from "@/lib/mockData";
import type { DateRangePreset } from "@/lib/mockData";

/** URL metric slugs for Content performance nav. Layout follows Figma: design/figma-library.json → partnerPortal.contentPerformancePage */
const CONTENT_PERFORMANCE_METRICS: Record<
  string,
  { pageTitle: string; dataMetric: ContentMetricTab }
> = {
  "top-content": { pageTitle: "Top content", dataMetric: "views" },
  views: { pageTitle: "Views", dataMetric: "views" },
  visitors: { pageTitle: "Visitors", dataMetric: "uniques" },
  reach: { pageTitle: "Reach", dataMetric: "reach" },
  uniques: { pageTitle: "Uniques", dataMetric: "uniques" },
  dwell: { pageTitle: "Dwell", dataMetric: "dwell" },
  comments: { pageTitle: "Comments", dataMetric: "comments" },
  ctr: { pageTitle: "CTR", dataMetric: "ctr" },
  video: { pageTitle: "Video", dataMetric: "views" },
};

/** In-page table dimension tabs. Figma: ChYlx1SqcGFnjxy6Khtst3 node 15692:41779. User stays on same metric page; only table view changes. */
const TABLE_DIMENSION_TABS: { id: ContentPerformanceTableDimension; label: string }[] = [
  { id: "date", label: "Date" },
  { id: "headline", label: "Headline" },
  { id: "content_type", label: "Content type" },
  { id: "region", label: "Region" },
  { id: "device", label: "Device" },
  { id: "category", label: "Category" },
];

/** Date and Content type have few rows; pagination is disabled for those tabs. */
const PAGINATION_DISABLED_DIMENSIONS: ContentPerformanceTableDimension[] = ["date", "content_type"];

function formatMetricValue(metric: ContentMetricTab, value: number) {
  if (metric === "ctr") return `${value.toFixed(2)}%`;
  if (metric === "dwell") return value.toFixed(1);
  return Math.round(value).toLocaleString("en-US");
}

export function ContentPerformanceDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { range } = useTimeFilter();
  const rangePreset: DateRangePreset = range;
  const [tableDimension, setTableDimension] = useState<ContentPerformanceTableDimension>("date");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const metricSlug = searchParams.get("metric") ?? "views";
  useEffect(() => {
    if (metricSlug === "top-content") {
      router.replace("/kpi/top-content");
      return;
    }
  }, [metricSlug, router]);

  useEffect(() => {
    setTableDimension("date");
    setCurrentPage(1);
  }, [metricSlug]);

  const showPagination = !PAGINATION_DISABLED_DIMENSIONS.includes(tableDimension);

  const config = CONTENT_PERFORMANCE_METRICS[metricSlug] ?? CONTENT_PERFORMANCE_METRICS.views;
  const { pageTitle, dataMetric } = config;

  const { points } = useMemo(
    () => getContentPerformanceMetricData(dataMetric, rangePreset),
    [dataMetric, rangePreset]
  );
  const tableData = useMemo(
    () => getContentPerformanceTableByDimension(dataMetric, tableDimension, rangePreset),
    [dataMetric, tableDimension, rangePreset]
  );

  const totalRows = tableData.rows.length;
  const paginatedRows = useMemo(() => {
    if (!showPagination) return tableData.rows;
    const start = (currentPage - 1) * pageSize;
    return tableData.rows.slice(start, start + pageSize);
  }, [tableData.rows, showPagination, currentPage, pageSize]);

  const summary = useMemo(() => {
    const values = tableData.rows.map((r) => r.value).filter((v) => Number.isFinite(v));
    if (values.length === 0) return { median: 0, average: 0, total: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
    const total = values.reduce((acc, v) => acc + v, 0);
    const average = total / values.length;
    return { median, average, total };
  }, [tableData.rows]);

  return (
    <div className="flex flex-col gap-4" key={metricSlug}>
      <PageHeader
        title={pageTitle}
        titleClassName="font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#232a31]"
        actions={<DownloadButton />}
      >
        <section aria-label="Filters" className="w-full">
          <FilterBar variant="contentPerformance" />
        </section>
      </PageHeader>

      <div className="flex flex-col gap-4 pb-8">
        <ContentPerformanceChart
          xLabels={points.map((p) => p.dateLabel)}
          values={points.map((p) => p.value)}
        />

        <div className="bg-white">
          <div
            className="sticky z-10 bg-white"
            style={{
              top: "var(--page-header-height, 0px)",
              backgroundColor: "#ffffff",
            }}
          >
            <nav
              aria-label="Table view"
              className="flex flex-wrap items-start gap-6 border-b border-[#f0f3f5] bg-white"
              style={{ backgroundColor: "#ffffff" }}
            >
            {TABLE_DIMENSION_TABS.map(({ id, label }) => {
              const isActive = tableDimension === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTableDimension(id);
                    setCurrentPage(1);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex-shrink-0 py-3 font-yahoo-product-sans text-[14px] leading-5 transition-all ${
                    isActive ? "font-medium text-[#232a31]" : "font-medium text-[#464e56] hover:font-semibold hover:text-[#232a31]"
                  }`}
                >
                  {label}
                  <span
                    className={`absolute bottom-0 left-0 h-1 w-full rounded-full ${
                      isActive ? "bg-[#7d2eff]" : "bg-transparent"
                    }`}
                    aria-hidden
                  />
                </button>
              );
            })}
            </nav>
          </div>

          <div className="flex items-center gap-2 bg-white py-6">
            <div className="flex flex-1 flex-col gap-4 rounded-[8px] border border-[#f0f3f5] p-5">
              <p className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#464e56]">
                Median performance:
              </p>
              <p
                key={`median-${dataMetric}-${summary.median}`}
                className="animate-fade-in-value font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#7c49fc]"
              >
                {formatMetricValue(dataMetric, summary.median)}
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-4 rounded-[8px] border border-[#f0f3f5] p-5">
              <p className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#464e56]">
                Average performance:
              </p>
              <p
                key={`average-${dataMetric}-${summary.average}`}
                className="animate-fade-in-value font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#7c49fc]"
              >
                {formatMetricValue(dataMetric, summary.average)}
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-4 rounded-[8px] border border-[#f0f3f5] p-5">
              <p className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#464e56]">
                Total performance
              </p>
              <p
                key={`total-${dataMetric}-${summary.total}`}
                className="animate-fade-in-value font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#7c49fc]"
              >
                {formatMetricValue(dataMetric, summary.total)}
              </p>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-[8px] border border-[#f0f3f5] bg-white">
            <div className="overflow-hidden">
              <table className="w-full table-fixed border-separate border-spacing-0 bg-white">
                <colgroup>
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="h-[52px] border-b border-[#f0f3f5] px-6 text-left align-middle font-yahoo-product-sans text-[12px] font-extrabold leading-[18px] text-[#475467]"
                    >
                      {tableData.firstColHeader}
                    </th>
                    <th
                      scope="col"
                      className="h-[52px] border-b border-[#f0f3f5] px-6 text-left align-middle font-yahoo-product-sans text-[12px] font-extrabold leading-[18px] text-[#475467]"
                    >
                      {tableData.secondColHeader}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row, index) => (
                    <tr
                      key={`${tableDimension}-${(currentPage - 1) * pageSize + index}-${row.label}`}
                    >
                      <td className="h-[52px] border-b border-[#f0f3f5] px-6 text-left align-middle font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31]">
                        {tableDimension === "headline" ? (
                          <span className="flex items-center gap-2">
                            <Icon
                              name={Article}
                              size="sm"
                              variant="outline"
                              className="h-4 w-4 shrink-0 text-[#464e56]"
                              aria-hidden
                            />
                            <span className="min-w-0 truncate">{row.label}</span>
                          </span>
                        ) : (
                          row.label
                        )}
                      </td>
                      <td className="h-[52px] border-b border-[#f0f3f5] px-6 text-left align-middle font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31]">
                        {formatMetricValue(dataMetric, row.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showPagination && (
              <div className="bg-white px-6">
                <TablePagination
                  totalRows={totalRows}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  onPageChange={setCurrentPage}
                  embedded
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

