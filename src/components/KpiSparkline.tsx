"use client";

import { useId, useRef, useEffect, useState } from "react";

const SPARKLINE_LINE_COLOR = "#B9B9B9";

interface KpiSparklineProps {
  data: number[];
  height?: number;
  lineColor?: string;
  dotRadius?: number;
  hideGradient?: boolean;
}

export function KpiSparkline({
  data,
  height = 48,
  lineColor = "#464e56",
  dotRadius = 2.5,
  hideGradient = false,
}: KpiSparklineProps) {
  const gradientId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(160);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!data || data.length < 2) {
    return <div ref={containerRef} className="w-full" style={{ height }} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padX = 4;
  const padY = 4;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * innerW,
    y: padY + (1 - (v - min) / range) * innerH,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  const areaPath = `${linePath} L${points[points.length - 1]!.x.toFixed(2)},${height} L${points[0]!.x.toFixed(2)},${height} Z`;

  const safeGradientId = `sparkline-${gradientId.replace(/:/g, "-")}`;

  return (
    <div ref={containerRef} className="w-full" style={{ height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={safeGradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stopColor={SPARKLINE_LINE_COLOR} stopOpacity={0.24} />
            <stop offset="0.5" stopColor={SPARKLINE_LINE_COLOR} stopOpacity={0.1} />
            <stop offset="1" stopColor={SPARKLINE_LINE_COLOR} stopOpacity={0.03} />
          </linearGradient>
        </defs>
        {!hideGradient && (
          <path
            d={areaPath}
            fill={`url(#${safeGradientId})`}
          />
        )}
        <path
          d={linePath}
          fill="none"
          stroke={SPARKLINE_LINE_COLOR}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={dotRadius}
            fill="#484848"
            aria-hidden
          />
        ))}
      </svg>
    </div>
  );
}
