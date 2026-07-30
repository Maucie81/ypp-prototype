"use client";

import Link from "next/link";
import ReactECharts from "echarts-for-react";
import { Icon } from "@yahoo/uds";
import { ChevronRight, Info } from "@yahoo/uds-icons";
import { DownloadButton } from "./DownloadButton";

export type PublishingOutcomeSeries = {
  xLabels: string[];
  published: number[];
  publishedWithWarnings: number[];
  failedToPublish: number[];
};

export function PerformancePublishingOutcomeCard({
  series,
  showLegendCounts = false,
  className,
}: {
  series: PublishingOutcomeSeries;
  showLegendCounts?: boolean;
  className?: string;
}) {
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const option = {
    animation: false,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#ffffff",
      borderColor: "#e0e4e9",
      borderWidth: 1,
      textStyle: {
        color: "#232a31",
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
      },
      padding: 10,
    },
    grid: { left: 42, right: 10, top: 8, bottom: 30 },
    xAxis: {
      type: "category",
      data: series.xLabels,
      axisTick: { show: false },
      axisLine: { show: true, lineStyle: { color: "#f0f3f5" } },
      axisLabel: { color: "#6e7780", fontSize: 12, margin: 8 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      interval: 20,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#6e7780", fontSize: 12 },
      splitLine: { show: true, lineStyle: { color: "#f0f3f5" } },
    },
    series: [
      {
        name: "Published",
        type: "bar",
        stack: "total",
        data: series.published,
        barMaxWidth: 24,
        itemStyle: { color: "#36ad84" },
      },
      {
        name: "Published with warnings",
        type: "bar",
        stack: "total",
        data: series.publishedWithWarnings,
        itemStyle: { color: "#ecc628" },
      },
      {
        name: "Failed to publish",
        type: "bar",
        stack: "total",
        data: series.failedToPublish,
        itemStyle: { color: "#fd6a74", borderRadius: [8, 8, 0, 0] },
      },
    ],
  };

  return (
    <section className={`flex min-h-0 w-full flex-col rounded-[8px] border border-[#e0e4e9] bg-white px-6 py-4 ${className ?? ""}`}>
      <header className="flex shrink-0 items-center justify-between gap-6">
        <p className="min-w-0 truncate font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#464e56]">
          Content items by publishing outcome
        </p>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <DownloadButton />
          <Link
            href="/feed-health"
            className="inline-flex size-8 items-center justify-center rounded-full border border-[#e0e4e9] bg-white hover:bg-[#f5f8fa]"
            aria-label="Open feed health"
          >
            <Icon name={ChevronRight} size="sm" variant="outline" className="w-3.5 h-3.5 text-[#6a6a6a]" />
          </Link>
        </div>
      </header>

      <div className="mt-6 flex shrink-0 flex-wrap items-center gap-4">
        <LegendSwatch color="#36ad84" label="Published" count={showLegendCounts ? sum(series.published) : undefined} />
        <LegendSwatch color="#ecc628" label="Published with warnings" count={showLegendCounts ? sum(series.publishedWithWarnings) : undefined} />
        <LegendSwatch color="#fd6a74" label="Not published" count={showLegendCounts ? sum(series.failedToPublish) : undefined} />
      </div>

      <div className="mt-4 min-h-0 flex-1">
        <ReactECharts option={option} style={{ height: "100%", minHeight: "280px", width: "100%" }} opts={{ renderer: "canvas" }} notMerge />
      </div>
    </section>
  );
}

function LegendSwatch({ color, label, count }: { color: string; label: string; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-3 rounded-[2px]" style={{ backgroundColor: color }} aria-hidden />
      <span className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#464e56]">
        {label}
        {count !== undefined && (
          <span className="ml-1 font-normal text-[#6e7780]">{count.toLocaleString("en-US")}</span>
        )}
      </span>
    </div>
  );
}

