"use client";

import ReactECharts from "echarts-for-react";

export function ContentPerformanceChart({
  xLabels,
  values,
}: {
  xLabels: string[];
  values: number[];
}) {
  const option = {
    animation: true,
    animationDuration: 450,
    animationEasing: "cubicOut" as const,
    animationDurationUpdate: 450,
    animationEasingUpdate: "cubicOut" as const,
    grid: {
      left: 44,
      right: 16,
      top: 12,
      bottom: 32,
    },
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
            color: "#5D5EFF",
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
        <div className="w-full min-w-0" style={{ height: 280 }}>
          <ReactECharts
            option={option}
            style={{ height: 280, width: "100%", minWidth: 0 }}
            opts={{ renderer: "canvas" }}
            notMerge
          />
        </div>
      </div>
    </div>
  );
}
