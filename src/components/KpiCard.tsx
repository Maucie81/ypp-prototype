"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Icon } from "@yahoo/uds";
import { ChevronRight, Info } from "@yahoo/uds-icons";
import { DeltaArrowIcon } from "./DeltaArrowIcon";
import { TrendingIcon } from "./TrendingIcon";
import { KpiLineChart } from "./KpiLineChart";

type Trend = "up" | "down" | "neutral";

export interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: Trend;
  helperText?: string;
  variant?: "primary" | "secondary";
  sparklineData?: number[];
  sparklineXLabels?: string[];
  href?: string;
  comparisonDate?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
}

function InlineDelta({ delta, trend }: { delta: string; trend: Trend }) {
  const color =
    trend === "up"
      ? "text-[#56C470]"
      : trend === "down"
        ? "text-[#FF4D52]"
        : "text-[#828a93]";

  const icon =
    trend === "up" ? (
      <TrendingIcon direction="up" className={color} />
    ) : trend === "down" ? (
      <TrendingIcon direction="down" className={color} />
    ) : (
      <DeltaArrowIcon direction="right" className={`h-3 w-3 shrink-0 ${color}`} />
    );

  return (
    <span className={`flex items-center gap-1 ${color}`}>
      {icon}
      <span className="font-yahoo-product-sans text-[13px] font-medium leading-5">
        {delta}
      </span>
    </span>
  );
}

function InfoTooltip({ label, helperText }: { label: string; helperText: string }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
    setOpen(true);
  };

  const tooltip = (
    <div
      role="tooltip"
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        transform: "translate(-50%, -100%)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
      className="flex flex-col items-center"
    >
      <div className="flex w-[240px] flex-col gap-1 rounded-[8px] bg-[#232a31] px-4 pb-4 pt-3 shadow-[0px_4px_16px_rgba(0,0,0,0.25)]">
        <p className="font-yahoo-product-sans text-[12px] font-medium leading-4 text-white">
          {label}
        </p>
        <p className="font-yahoo-product-sans text-[12px] font-normal leading-4 text-white/80">
          {helperText}
        </p>
      </div>
      <svg width="16" height="8" viewBox="0 0 16 8" className="shrink-0" aria-hidden="true">
        <path d="M0 0 L8 8 L16 0 Z" fill="#232a31" />
      </svg>
    </div>
  );

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setOpen(false)}
    >
      <span ref={iconRef} aria-label={`About ${label}`} className="flex items-center cursor-default">
        <Icon name={Info} size="xs" variant="outline" className="h-[12px] w-[12px] shrink-0 !text-[#828a93]" />
      </span>
      {open && typeof document !== "undefined" && createPortal(tooltip, document.body)}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  trend = "neutral",
  helperText,
  variant = "primary",
  sparklineData,
  sparklineXLabels,
  href,
  comparisonDate,
  icon,
}: KpiCardProps) {
  const isPrimary = variant === "primary";
  const showSparkline = isPrimary && Boolean(sparklineData?.length);

  if (isPrimary) {
    const cardClassName =
      "relative flex min-h-[112px] flex-col items-stretch rounded-[10px] border border-[#e0e4e9] bg-[#fafafa] p-6";
    const content = (
      <div className="flex flex-col gap-0 h-full">
        <div className="flex min-w-0 flex-col gap-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && (
                <Icon name={icon} size="xs" variant="outline" className="h-[16px] w-[16px] shrink-0 text-[#464e56]" />
              )}
              <p className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
                {label}
              </p>
              <InfoTooltip label={label} helperText={helperText ?? ""} />
            </div>
            <Icon name={ChevronRight} size="sm" variant="outline" className="h-3.5 w-3.5 shrink-0 text-[#6a6a6a]" />
          </div>
          <div className="flex items-end gap-2">
            <p className="font-yahoo-product-sans text-[24px] font-bold leading-[1] text-[#232a31]">
              {value}
            </p>
            {delta ? <InlineDelta delta={delta} trend={trend} /> : null}
          </div>
        </div>
        {showSparkline && sparklineData ? (
          <>
            <div className="h-[1px] bg-[#e0e4e9] mb-2" />
            <div className="flex-1 min-h-0">
              <KpiLineChart data={sparklineData} xLabels={sparklineXLabels ?? []} height={240} />
            </div>
          </>
        ) : null}
      </div>
    );
    if (href) {
      return (
        <Link href={href} className={cardClassName} style={{ textDecoration: "none", color: "inherit" }}>
          {content}
        </Link>
      );
    }
    return <section className={cardClassName}>{content}</section>;
  }

  // Secondary variant — Figma: Secondary Chip_Small
  const cardClassName =
    "relative flex flex-col rounded-[10px] border border-[#e0e4e9] bg-[#fafafa] px-6 py-4";
  const content = (
    <div className="flex flex-col gap-4">
      {/* Header row: icon + label + info + chevron */}
      <div className="flex items-center h-8 pb-2 border-b border-[#e0e4e9]">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          {icon && (
            <Icon name={icon} size="xs" variant="outline" className="h-[16px] w-[16px] shrink-0 text-[#464e56]" />
          )}
          <p className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31] truncate">
            {label}
          </p>
          <InfoTooltip label={label} helperText={helperText ?? ""} />
        </div>
        <Icon name={ChevronRight} size="sm" variant="outline" className="h-3.5 w-3.5 shrink-0 text-[#6a6a6a] ml-2" />
      </div>

      {/* Data rows */}
      <div className="flex items-end gap-2">
        <p className="font-yahoo-product-sans text-[24px] font-bold leading-[1] text-[#232a31]">
          {value}
        </p>
        {delta ? <InlineDelta delta={delta} trend={trend} /> : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cardClassName} style={{ textDecoration: "none", color: "inherit" }}>
        {content}
      </Link>
    );
  }
  return <section className={cardClassName}>{content}</section>;
}
