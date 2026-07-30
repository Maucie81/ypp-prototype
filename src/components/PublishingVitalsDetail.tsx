"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@yahoo/uds";
import { ChevronRight, Info } from "@yahoo/uds-icons";
import { PageHeader } from "@/components/PageHeader";
import { FilterBar } from "@/components/filters/FilterBar";
import { KpiCard } from "@/components/KpiCard";
import { PerformancePublishingOutcomeCard } from "@/components/PerformancePublishingOutcomeCard";
import { DownloadButton } from "@/components/DownloadButton";
import { KpiSparkline } from "@/components/KpiSparkline";
import { PublishStatusLabel } from "@/components/PublishStatusLabel";
import { TablePagination } from "@/components/TablePagination";
import { BrandIcon } from "@/components/BrandIcon";
import { WarningIssueModal } from "@/components/WarningIssueModal";
import { FailureIssueModal } from "@/components/FailureIssueModal";
import {
  getSampleContentItem,
  type FeedVitalsRow,
  type IssueSummaryRow,
  type PublishingVitalsKpi,
  type PublishingOutcomeSeries,
  type ContentModalItem,
} from "@/lib/mockData";

// ─── Section card wrapper ─────────────────────────────────────────────────────

function SectionCard({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-[#e0e4e9] bg-white px-6 py-5">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#464e56]">
            {title}
          </h2>
          <Icon
            name={Info}
            size="xs"
            variant="outline"
            className="h-[12px] w-[12px] shrink-0 text-[#6a6a6a]"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </header>
      <div className="mt-5">{children}</div>
    </section>
  );
}

// ─── Table header cell ────────────────────────────────────────────────────────

function thAlign(right?: boolean, center?: boolean) {
  if (center) return "text-center";
  return right ? "text-right" : "text-left";
}

function thPadding(compactRight?: boolean, spacious?: boolean) {
  if (compactRight) return "pl-3 pr-1";
  if (spacious) return "pl-5 pr-5";
  return "pl-3 pr-3";
}

function Th({ children, right, center, compactRight, spacious }: { children: React.ReactNode; right?: boolean; center?: boolean; compactRight?: boolean; spacious?: boolean }) {
  return (
    <th
      className={`whitespace-nowrap border-b border-[#f0f3f5] py-3 font-yahoo-product-sans text-[13px] font-medium leading-4 text-[#6e7780] first:pl-0 last:pr-0 ${thPadding(compactRight, spacious)} ${thAlign(right, center)}`}
    >
      {children}
    </th>
  );
}

function Td({ children, right, center, compactRight, spacious }: { children: React.ReactNode; right?: boolean; center?: boolean; compactRight?: boolean; spacious?: boolean }) {
  return (
    <td
      className={`border-b border-[#f5f8fa] py-[14px] font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] first:pl-0 last:pr-0 ${thPadding(compactRight, spacious)} ${thAlign(right, center)}`}
    >
      {children}
    </td>
  );
}

// ─── Feeds table ──────────────────────────────────────────────────────────────

function FeedsTable({
  rows,
  getRowHref,
}: {
  rows: FeedVitalsRow[];
  getRowHref?: (row: FeedVitalsRow) => string;
}) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Status</Th>
            <Th>Type</Th>
            <Th compactRight>Name</Th>
            <Th center spacious>Brand</Th>
            <Th center spacious>Success</Th>
            <Th center spacious>Last run</Th>
            <Th center spacious>Average latency</Th>
            <Th center spacious>Created</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={`min-h-[48px] hover:bg-[#fafbfc] ${getRowHref ? "cursor-pointer" : ""}`}
              role={getRowHref ? "button" : undefined}
              tabIndex={getRowHref ? 0 : undefined}
              onClick={
                getRowHref
                  ? () => router.push(getRowHref(row))
                  : undefined
              }
              onKeyDown={
                getRowHref
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(getRowHref(row));
                      }
                    }
                  : undefined
              }
            >
              <Td>
                <span className="font-mono text-[13px] text-[#464e56]">{row.id}</span>
              </Td>
              <Td>
                <PublishStatusLabel variant={row.status} />
              </Td>
              <Td>
                {row.contentType.charAt(0).toUpperCase() + row.contentType.slice(1)}
              </Td>
              <Td compactRight>
                <span className="truncate text-[#232a31]">
                  {row.name.replace(/\s*·\s*(Video|Article|Slideshow)\s*·\s*/gi, " · ")}
                </span>
              </Td>
              <Td center spacious>
                <BrandIcon brand={row.brand} />
              </Td>
              <Td center spacious>
                <span className={row.success >= 95 ? "text-[#0c7a58]" : row.success >= 80 ? "text-[#7a5800]" : "text-[#a80d1c]"}>
                  {row.success}%
                </span>
              </Td>
              <Td center spacious>
                <span className="text-[#6e7780]">{row.lastRun}</span>
              </Td>
              <Td center spacious>
                <span className={row.avgLatency > 150 ? "text-[#a80d1c]" : "text-[#232a31]"}>
                  {row.avgLatency}ms
                </span>
              </Td>
              <Td center spacious>
                <span className="text-[#6e7780]">{row.created}</span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Issues detected table. Figma 12101-360201: 56px rows, 32px horizontal padding, #e3e3e3 borders, hover #f5f8fa, chevron 16px on hover. ───
const ISSUES_HEADER_CLASS =
  "whitespace-nowrap border-b border-[#e3e3e3] py-2.5 font-yahoo-product-sans text-[13px] font-medium leading-4 text-[#6e7780] px-5 first:pl-8 last:pr-8";
const ISSUES_CELL_CLASS =
  "border-b border-[#e3e3e3] py-2.5 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] px-5 first:pl-8 last:pr-8";

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
          <col style={{ width: "28%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "40px" }} />
        </colgroup>
        <thead>
          <tr>
            <th className={`${ISSUES_HEADER_CLASS} text-left`}>Issue</th>
            <th className={`${ISSUES_HEADER_CLASS} text-left`}>Type</th>
            <th className={`${ISSUES_HEADER_CLASS} text-center`}>Trend</th>
            <th className={`${ISSUES_HEADER_CLASS} text-right`}>Volume</th>
            <th className="w-10 border-b border-[#e3e3e3] py-2.5 pl-5 pr-8 font-yahoo-product-sans text-[13px] font-medium leading-4 text-[#6e7780]" aria-hidden />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="group min-h-[56px] cursor-pointer hover:bg-[#f5f8fa]"
              onClick={() =>
                router.push(
                  `/feed-health/issues/${row.id}/${
                    row.type === "published_with_warning" ? "warning" : "failure"
                  }`,
                )
              }
            >
              <td className={`${ISSUES_CELL_CLASS} text-left`}>
                <span className="min-w-0 truncate">{row.issue}</span>
              </td>
              <td className={`${ISSUES_CELL_CLASS} text-left`}>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onBadgeClick?.(row);
                  }}
                >
                  <PublishStatusLabel
                    variant={row.type === "published_with_warning" ? "Published with warning" : "Not published"}
                  />
                </span>
              </td>
              <td className={`${ISSUES_CELL_CLASS} text-center`}>
                <div className="mx-auto h-6 w-full max-w-[140px] min-w-0">
                  <KpiSparkline
                    data={row.trend}
                    height={24}
                    lineColor={row.type === "published_with_warning" ? "#e26900" : "#d30d2e"}
                    dotRadius={2}
                  />
                </div>
              </td>
              <td className={`${ISSUES_CELL_CLASS} text-right`}>
                <span className="tabular-nums">
                  {row.volume.toLocaleString("en-US")}
                </span>
              </td>
              <td className="border-b border-[#e3e3e3] py-2.5 pl-5 pr-8 text-right align-middle">
                <span
                  className="inline-flex size-4 items-center justify-center text-[#6e7780] opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                >
                  <Icon name={ChevronRight} size="xs" variant="outline" className="size-4" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PublishingVitalsDetail({
  kpis,
  feedRows,
  issueRows,
  publishingSeries,
}: {
  kpis: PublishingVitalsKpi[];
  feedRows: FeedVitalsRow[];
  issueRows: IssueSummaryRow[];
  publishingSeries: PublishingOutcomeSeries;
}) {
  const [feedPageSize, setFeedPageSize] = useState(10);
  const [feedPage, setFeedPage] = useState(1);
  const [issuePageSize, setIssuePageSize] = useState(10);
  const [issuePage, setIssuePage] = useState(1);

  // ── Modal state ──
  const [warnModal, setWarnModal] = useState<ContentModalItem | null>(null);
  const [failModal, setFailModal] = useState<ContentModalItem | null>(null);

  const feedStart = (feedPage - 1) * feedPageSize;
  const feedVisible = feedRows.slice(feedStart, feedStart + feedPageSize);
  const issueStart = (issuePage - 1) * issuePageSize;
  const issueVisible = issueRows.slice(issueStart, issueStart + issuePageSize);

  return (
    <>
    <div className="flex flex-col">
      {/* Page header + filters */}
      <PageHeader title="Feed health" slotClassName="pb-0">
        <section aria-label="Filters" className="w-full">
          <FilterBar variant="overview" />
        </section>
      </PageHeader>

      <div className="mt-[8px] flex flex-col gap-8">
      {/* KPI cards — same treatment as Overview: white bg, border #e0e4e9, rounded-[10px], 24px padding */}
      <section
        aria-label="Feed health KPIs"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
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

      {/* List of feeds */}
      <SectionCard
        title="List of feeds"
        actions={<DownloadButton />}
      >
        <FeedsTable
          rows={feedVisible}
          getRowHref={(row) => `/feed-health/${row.id}`}
        />
        <TablePagination
          totalRows={feedRows.length}
          pageSize={feedPageSize}
          currentPage={feedPage}
          onPageSizeChange={(size) => {
            setFeedPageSize(size);
            setFeedPage(1);
          }}
          onPageChange={setFeedPage}
        />
      </SectionCard>

      {/* Content items by publishing outcome chart */}
      <PerformancePublishingOutcomeCard series={publishingSeries} showLegendCounts />

      {/* Issues detected */}
      <SectionCard
        title="Issues detected"
        actions={<DownloadButton />}
      >
        <IssuesTable
          rows={issueVisible}
          onBadgeClick={(row) => {
            const item = getSampleContentItem(row.id);
            if (row.type === "published_with_warning") setWarnModal(item);
            else setFailModal(item);
          }}
        />
        <TablePagination
          totalRows={issueRows.length}
          pageSize={issuePageSize}
          currentPage={issuePage}
          onPageSizeChange={(size) => {
            setIssuePageSize(size);
            setIssuePage(1);
          }}
          onPageChange={setIssuePage}
        />
      </SectionCard>
      </div>
    </div>

      {/* ── Modals ── */}
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
