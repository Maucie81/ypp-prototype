"use client";

import { useState, useRef, useEffect } from "react";
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

interface ClickTip {
  x: number;
  y: number;
  date: string;
  value: number;
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
  const [clickTip, setClickTip] = useState<ClickTip | null>(null);

  const seriesData = data[activeTab];

  useEffect(() => {
    const handleMouseDown = () => setClickTip(null);
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const handleChartClick = (params: {
    name: string;
    data: number;
    event: { event: { offsetX: number; offsetY: number } };
  }) => {
    if (params.name == null || params.data == null) return;
    setClickTip({
      x: params.event.event.offsetX,
      y: params.event.event.offsetY,
      date: params.name,
      value: typeof params.data === "number" ? params.data : Number(params.data),
    });
  };

  const option = {
    animation: false,
    tooltip: { show: false },
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
              onClick={() => { setActiveTab(tab.key); setClickTip(null); }}
              className={`relative shrink-0 py-3 font-yahoo-product-sans text-[14px] leading-5 focus-visible:outline-none ${
                activeTab === tab.key
                  ? "font-medium text-[#232a31]"
                  : "font-normal text-[#464e56] hover:text-[#232a31]"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 h-1 w-full rounded-t-sm bg-[#6155F5]" aria-hidden />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-2">
        <div
          className="w-full"
          style={{ height: 280 }}
          onMouseLeave={() => setClickTip(null)}
        >
          <ReactECharts
            key={activeTab}
            option={option}
            style={{ height: 280, width: "100%" }}
            opts={{ renderer: "canvas" }}
            notMerge
            onEvents={{ click: handleChartClick }}
          />
        </div>

        {/* Click tooltip — "Featured in the NTK" speech bubble */}
        {clickTip && (
          <div
            className="pointer-events-none absolute z-20 flex flex-col items-center"
            style={{
              left: `${clickTip.x}px`,
              top: `${clickTip.y}px`,
              transform: "translate(-50%, calc(-100% - 14px))",
            }}
          >
            <div className="rounded-[8px] bg-[#232a31] px-4 py-3 text-white shadow-lg">
              <p className="font-yahoo-product-sans text-[14px] font-semibold leading-5 whitespace-nowrap">
                {clickTip.date}
              </p>
              <p className="font-yahoo-product-sans text-[12px] leading-4 text-white/70 mt-0.5 whitespace-nowrap">
                {clickTip.value.toLocaleString("en-US")}
              </p>
            </div>
            {/* Arrow */}
            <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#232a31]" />
          </div>
        )}
      </div>
    </section>
  );
}
