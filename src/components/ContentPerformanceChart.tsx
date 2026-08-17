"use client";

import { useState, useRef } from "react";
import ReactECharts from "echarts-for-react";

interface HoverTip {
  x: number;
  y: number;
  date: string;
  value: number;
}

const GRID_LEFT = 44;
const GRID_RIGHT = 16;
const GRID_TOP = 12;
const GRID_BOTTOM = 32;
const CHART_HEIGHT = 280;

export function ContentPerformanceChart({
  xLabels,
  values,
}: {
  xLabels: string[];
  values: number[];
}) {
  const [clickTip, setClickTip] = useState<HoverTip | null>(null);
  const chartRef = useRef<ReactECharts | null>(null);
  const lastIndex = useRef<number | null>(null);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const plotWidth = rect.width - GRID_LEFT - GRID_RIGHT;
    const fraction = (e.clientX - rect.left - GRID_LEFT) / plotWidth;
    const clamped = Math.min(1, Math.max(0, fraction));
    const index = Math.round(clamped * (xLabels.length - 1));

    const previousIndex = lastIndex.current;
    if (index === previousIndex) return;
    lastIndex.current = index;

    const value = values[index];
    const xLocal = GRID_LEFT + (index / (xLabels.length - 1)) * plotWidth;
    const plotHeight = CHART_HEIGHT - GRID_TOP - GRID_BOTTOM;
    const yLocal = GRID_TOP + (1 - value / 100) * plotHeight;

    setClickTip({ x: xLocal, y: yLocal, date: xLabels[index], value });

    const instance = chartRef.current?.getEchartsInstance();
    if (previousIndex !== null) {
      instance?.dispatchAction({ type: "downplay", seriesIndex: 0, dataIndex: previousIndex });
    }
    instance?.dispatchAction({ type: "highlight", seriesIndex: 0, dataIndex: index });
  };

  const handlePointerLeave = () => {
    lastIndex.current = null;
    setClickTip(null);
    chartRef.current?.getEchartsInstance().dispatchAction({ type: "downplay", seriesIndex: 0 });
  };

  const option = {
    animation: false,
    grid: {
      left: 44,
      right: 16,
      top: 12,
      bottom: 32,
    },
    tooltip: { show: false },
    xAxis: {
      type: "category",
      data: xLabels,
      boundaryGap: false,
      axisTick: { show: true, alignWithLabel: true, lineStyle: { color: "#f0f3f5" }, length: 4 },
      axisLine: { show: true, lineStyle: { color: "#f0f3f5" } },
      axisLabel: { color: "#6e7780", fontSize: 12, margin: 10 },
      splitLine: { show: true, lineStyle: { color: "#f0f3f5", width: 1 } },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      interval: 20,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: "#6e7780", fontSize: 12 },
      splitLine: { show: true, lineStyle: { color: "#f0f3f5", width: 1 } },
    },
    series: [
      {
        type: "line",
        data: values,
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
              { offset: 0, color: "rgba(185, 185, 185, 0.24)" },
              { offset: 0.5, color: "rgba(185, 185, 185, 0.10)" },
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
    <div className="w-full rounded-[8px] bg-white">
      <div className="w-full py-4">
        <div className="relative w-full min-w-0">
          <div
            className="w-full min-w-0"
            style={{ height: 280 }}
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerLeave}
          >
            <ReactECharts
              ref={chartRef}
              option={option}
              style={{ height: 280, width: "100%", minWidth: 0 }}
              opts={{ renderer: "canvas" }}
              notMerge
            />
          </div>

          {/* Hover tooltip — "Featured in the NTK" speech bubble */}
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
                  {clickTip.value.toLocaleString("en-US")}%
                </p>
              </div>
              <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#232a31]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
