"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { BrandComparisonTable } from "@/components/BrandComparisonTable";
import { FilterBar } from "@/components/filters/FilterBar";
import { PerformancePublishingOutcomeCard } from "@/components/PerformancePublishingOutcomeCard";
import { RankedContentTable } from "@/components/RankedContentTable";
import { VideoCard } from "@/components/VideoCard";
import { DownloadButton } from "@/components/DownloadButton";
import { Icon } from "@yahoo/uds";
import { ChevronRight, Eye, Article, Person, Megaphone, Graph, Play, Clock, SpeechBubble } from "@yahoo/uds-icons";
import Link from "next/link";
import { useTimeFilter } from "@/contexts/TimeFilterContext";
import { useBrand } from "@/contexts/BrandContext";
import {
  getBrandComparisonRows,
  getOverviewPrimaryKpis,
  getOverviewSecondaryKpis,
  getPublishingOutcomeSeries,
  getRankedContentRows,
  getVideoSeriesData,
} from "@/lib/mockData";
import type { DateRangePreset, KpiId } from "@/lib/mockData";

const kpiIconMap: Record<KpiId, unknown> = {
  traffic: Eye,
  revenue: Article,
  ctr: Person,
  errorRate: Megaphone,
  activeFeeds: Graph,
  fillRate: Play,
  avgPosition: Clock,
  contentItems: SpeechBubble,
};

/** Map Overview KPI id to Content performance dropdown route. */
function getKpiContentPerformanceHref(id: KpiId): string {
  const map: Record<KpiId, string> = {
    traffic: "/kpi?metric=views",
    revenue: "/kpi/top-content",
    ctr: "/kpi?metric=visitors",
    errorRate: "/kpi?metric=reach",
    activeFeeds: "/kpi?metric=ctr",
    fillRate: "/kpi?metric=video",
    avgPosition: "/kpi?metric=dwell",
    contentItems: "/kpi?metric=comments",
  };
  return map[id] ?? "/kpi?metric=views";
}

export default function OverviewPage() {
  const { range } = useTimeFilter();
  const { brandId, isSwitching } = useBrand();
  const rangePreset: DateRangePreset = range;

  const primaryKpis = useMemo(
    () => getOverviewPrimaryKpis(rangePreset, brandId),
    [rangePreset, brandId]
  );
  const secondaryKpis = useMemo(
    () => getOverviewSecondaryKpis(rangePreset, brandId),
    [rangePreset, brandId]
  );
  const rankedContentRows = useMemo(
    () => getRankedContentRows(rangePreset, brandId),
    [rangePreset, brandId]
  );
  const brandComparisonRows = useMemo(
    () => getBrandComparisonRows(rangePreset, brandId),
    [rangePreset, brandId]
  );
  const publishingOutcomeSeries = useMemo(
    () => getPublishingOutcomeSeries(rangePreset, brandId),
    [rangePreset, brandId]
  );
  const videoData = useMemo(
    () => getVideoSeriesData(rangePreset, brandId),
    [rangePreset, brandId]
  );

  return (
    <div className="flex flex-col">
      <PageHeader title="Overview" slotClassName="pb-0">
        <section aria-label="Filters" className="w-full">
          <FilterBar variant="overview" />
        </section>
      </PageHeader>

      <div className="mt-[8px] flex flex-col gap-8">
      {isSwitching ? (
        <>
          {/* KPI skeletons */}
          <section>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-[10px] border border-[#e0e4e9] bg-[#fafafa] px-5 py-4 flex flex-col gap-4">
                  <div className="h-8 flex items-center border-b border-[#e0e4e9] pb-2 gap-2">
                    <div className="h-4 w-4 rounded bg-[#e0e4e9] shrink-0" />
                    <div className="h-3.5 w-24 rounded bg-[#e0e4e9]" />
                  </div>
                  <div className="h-7 w-28 rounded bg-[#e0e4e9]" />
                </div>
              ))}
            </div>
          </section>

          {/* Chart + Ranked content skeletons */}
          <div className="grid items-stretch gap-6 lg:grid-cols-2 animate-pulse">
            {/* Publishing outcome skeleton */}
            <div className="rounded-[8px] border border-[#e0e4e9] bg-white p-6 flex flex-col gap-4 min-h-[320px]">
              <div className="h-4 w-48 rounded bg-[#e0e4e9]" />
              <div className="flex items-end gap-2 flex-1 pt-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-t bg-[#e0e4e9]" style={{ height: `${50 + (i % 3) * 20}%` }} />
                ))}
              </div>
            </div>
            {/* Ranked content skeleton */}
            <div className="rounded-[8px] border border-[#e0e4e9] bg-white p-6 flex flex-col gap-4">
              <div className="h-4 w-32 rounded bg-[#e0e4e9]" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-[#f0f3f5]">
                  <div className="h-3.5 w-4 rounded bg-[#e0e4e9] shrink-0" />
                  <div className="h-3.5 flex-1 rounded bg-[#e0e4e9]" />
                  <div className="h-3.5 w-16 rounded bg-[#e0e4e9] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Video skeleton */}
          <div className="rounded-[8px] border border-[#e0e4e9] bg-white p-6 flex flex-col gap-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 w-16 rounded bg-[#e0e4e9]" />
              <div className="h-4 w-4 rounded bg-[#e0e4e9]" />
            </div>
            <div className="flex gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-3.5 w-24 rounded bg-[#e0e4e9]" />
              ))}
            </div>
            <div className="h-[200px] rounded bg-[#e0e4e9]" />
          </div>

          {/* Brand comparison skeleton */}
          <div className="rounded-[8px] border border-[#e0e4e9] bg-white p-6 flex flex-col gap-4 animate-pulse">
            <div className="h-4 w-36 rounded bg-[#e0e4e9]" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-[#f0f3f5]">
                <div className="h-3.5 w-4 rounded bg-[#e0e4e9] shrink-0" />
                <div className="h-3.5 flex-1 rounded bg-[#e0e4e9]" />
                <div className="h-3.5 w-16 rounded bg-[#e0e4e9] shrink-0" />
                <div className="h-3.5 w-16 rounded bg-[#e0e4e9] shrink-0" />
                <div className="h-3.5 w-16 rounded bg-[#e0e4e9] shrink-0" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* KPI cards */}
          <section>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {[...primaryKpis, ...secondaryKpis].map((kpi) => (
                <KpiCard
                  key={kpi.id}
                  variant="secondary"
                  label={kpi.label}
                  value={kpi.value}
                  delta={kpi.delta}
                  trend={kpi.trend}
                  helperText={kpi.helperText}
                  href={getKpiContentPerformanceHref(kpi.id)}
                  comparisonDate={kpi.comparisonDate}
                  icon={kpiIconMap[kpi.id]}
                />
              ))}
            </div>
          </section>

          {/* Performance chart + Ranked content — equal height cards, bottom edges aligned */}
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            <div className="flex min-h-0 flex-col">
              <PerformancePublishingOutcomeCard series={publishingOutcomeSeries} className="h-full min-h-0" />
            </div>

            <div className="flex min-h-0 flex-col rounded-[8px] border border-[#e0e4e9] bg-white p-6">
              <div className="mb-4 flex shrink-0 items-center justify-between gap-6">
                <h2 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#464e56]">
                  Ranked content
                </h2>
                <div className="flex shrink-0 items-center gap-2">
                  <DownloadButton />
                  <Link
                    href="/kpi/top-content"
                    className="inline-flex size-8 items-center justify-center rounded-full border border-[#e0e4e9] bg-white hover:bg-[#f5f8fa]"
                    aria-label="Open top content"
                  >
                    <Icon name={ChevronRight} size="sm" variant="outline" className="w-3.5 h-3.5 text-[#6a6a6a]" />
                  </Link>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto">
                <RankedContentTable rows={rankedContentRows} />
              </div>
            </div>
          </div>

          {/* Video section */}
          <VideoCard data={videoData} />

          {/* Brand comparison */}
          <div className="rounded-[8px] border border-[#e0e4e9] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#464e56]">
                Brand comparison
              </h2>
              <DownloadButton />
            </div>
            <BrandComparisonTable rows={brandComparisonRows} />
          </div>
        </>
      )}
      </div>
    </div>
  );
}
