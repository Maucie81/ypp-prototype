"use client";

import ReactECharts from "echarts-for-react";

interface KpiLineChartProps {
  data: number[];
  xLabels: string[];
  height?: number;
}

function formatYAxis(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${Math.round(val / 1_000)}k`;
  return String(val);
}

export function KpiLineChart({ data, xLabels, height = 240 }: KpiLineChartProps) {
  const option = {
    animation: false,
    grid: {
      left: 44,
      right: 12,
      top: 8,
      bottom: 28,
    },
    tooltip: { show: false },
    xAxis: {
      type: "category",
      data: xLabels,
      boundaryGap: false,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#9aa0a7",
        fontSize: 11,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
        margin: 8,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#9aa0a7",
        fontSize: 11,
        fontFamily: "Yahoo_Product_Sans_VF, sans-serif",
        formatter: formatYAxis,
        margin: 8,
      },
      splitLine: {
        show: true,
        lineStyle: { color: "#e8ecef", width: 1, type: "dashed" },
      },
    },
    series: [
      {
        type: "line",
        data,
        smooth: false,
        showSymbol: false,
        lineStyle: { color: "#1C4FFF", width: 2 },
        itemStyle: { color: "#1C4FFF" },
        areaStyle: undefined,
        emphasis: { disabled: true },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ width: "100%", height }}
      notMerge
    />
  );
}
