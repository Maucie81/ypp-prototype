"use client";

import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { Icon } from "@yahoo/uds";
import { ChevronRight, Info } from "@yahoo/uds-icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type VideoMetric = "streams" | "streamers" | "watchMinutes" | "medianView" | "completion";

export interface VideoSeriesData {
  xLabels: string[];
  streams: number[];
  streamers: number[];
  watchMinutes: number[];
  medianView: number[];
  completion: number[];
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS: { key: VideoMetric; label: string }[] = [
  { key: "streams", label: "Video streams" },
  { key: "streamers", label: "Streamers" },
  { key: "watchMinutes", label: "Total watched minutes" },
  { key: "medianView", label: "Median view time" },
  { key: "completion", label: "Completion rate" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoCard({ data }: { data: VideoSeriesData }) {
  const [activeTab, setActiveTab] = useState<VideoMetric>("streams");

  const seriesData = data[activeTab];

  const option = {
    animation: true,
    animationDuration: 450,
    animationEasing: "cubicOut" as const,
    animationDurationUpdate: 450,
    animationEasingUpdate: "cubicOut" as const,
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
    grid: { left: 44, right: 16, top: 12, bottom: 40 },
    xAxis: {
      type: "category",
      data: data.xLabels,
      boundaryGap: false,
      axisTick: { show: true, alignWithLabel: true, lineStyle: { color: "#e0e4e9" }, length: 4 },
      axisLine: { show: true, lineStyle: { color: "#e0e4e9" } },
      axisLabel: { color: "#6e7780", fontSize: 12, margin: 10 },
      splitLine: { show: true, lineStyle: { color: "#f0f3f5", width: 1 } },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      interval: 20,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#6e7780", fontSize: 12 },
      splitLine: { show: true, lineStyle: { color: "#f0f3f5", width: 1 } },
    },
    series: [
      {
        type: "line",
        data: seriesData,
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
              { offset: 0, color: "rgba(185, 185, 185, 0.22)" },
              { offset: 0.5, color: "rgba(185, 185, 185, 0.09)" },
              { offset: 1, color: "rgba(185, 185, 185, 0.03)" },
            ],
          },
        },
        emphasis: {
          showSymbol: true,
          symbolSize: 6,
          itemStyle: {
            color: "#7d2eff",
            borderColor: "rgba(125, 46, 255, 0.28)",
            borderWidth: 10,
          },
        },
      },
    ],
  };

  return (
    <section className="w-full rounded-[8px] border border-[#e0e4e9] bg-white p-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <h2 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#464e56]">
          Video
        </h2>
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-full border border-[#e0e4e9] bg-white hover:bg-[#f5f8fa]"
          aria-label="Open video detail"
        >
          <Icon name={ChevronRight} size="sm" variant="outline" className="w-3.5 h-3.5 text-[#6a6a6a]" />
        </button>
      </header>

      {/* Tab bar */}
      <div className="mt-3 border-b border-[#f0f3f5]">
        <div className="flex gap-5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`group relative shrink-0 py-3 font-yahoo-product-sans text-[14px] leading-5 transition-all focus-visible:outline-none ${
                activeTab === tab.key
                  ? "font-medium text-[#232a31]"
                  : "font-normal text-[#464e56] hover:font-medium hover:text-[#232a31]"
              }`}
            >
              {tab.label}
              <span
                className={`absolute bottom-0 left-0 h-1 w-full rounded-full ${
                  activeTab === tab.key ? "bg-[#6155F5]" : "bg-transparent"
                }`}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-2">
        <div className="w-full" style={{ height: 280 }}>
          <ReactECharts
            option={option}
            style={{ height: 280, width: "100%" }}
            opts={{ renderer: "canvas" }}
            notMerge={false}
          />
        </div>
      </div>
    </section>
  );
}
