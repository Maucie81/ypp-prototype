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
import { ChevronRight, Info } from "@yahoo/uds-icons";
import Link from "next/link";
import { useTimeFilter } from "@/contexts/TimeFilterContext";
import {
  getBrandComparisonRows,
  getOverviewPrimaryKpis,
  getOverviewSecondaryKpis,
  getPublishingOutcomeSeries,
  getRankedContentRows,
  getVideoSeriesData,
} from "@/lib/mockData";
import type { DateRangePreset, KpiId } from "@/lib/mockData";

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
  const rangePreset: DateRangePreset = range;

  const primaryKpis = useMemo(
    () => getOverviewPrimaryKpis(rangePreset),
    [rangePreset]
  );
  const secondaryKpis = useMemo(
    () => getOverviewSecondaryKpis(rangePreset),
    [rangePreset]
  );
  const rankedContentRows = useMemo(
    () => getRankedContentRows(rangePreset),
    [rangePreset]
  );
  const brandComparisonRows = useMemo(
    () => getBrandComparisonRows(rangePreset),
    [rangePreset]
  );
  const publishingOutcomeSeries = useMemo(
    () => getPublishingOutcomeSeries(rangePreset),
    [rangePreset]
  );
  const videoData = useMemo(
    () => getVideoSeriesData(rangePreset),
    [rangePreset]
  );

  return (
    <div className="flex flex-col">
      <PageHeader title="Overview" slotClassName="pb-0">
        <section aria-label="Filters" className="w-full">
          <FilterBar variant="overview" />
        </section>
      </PageHeader>

      <div className="mt-[8px] flex flex-col gap-8">
      {/* KPI cards */}
      <section className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {primaryKpis.map((kpi) => (
            <KpiCard
              key={kpi.id}
              variant="primary"
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              trend={kpi.trend}
              helperText={kpi.helperText}
              sparklineData={kpi.sparklineData}
              href={getKpiContentPerformanceHref(kpi.id)}
            />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryKpis.map((kpi) => (
            <KpiCard
              key={kpi.id}
              variant="secondary"
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              trend={kpi.trend}
              helperText={kpi.helperText}
              href={getKpiContentPerformanceHref(kpi.id)}
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
      </div>
    </div>
  );
}
