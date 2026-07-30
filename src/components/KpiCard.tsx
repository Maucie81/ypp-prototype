"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Icon } from "@yahoo/uds";
import { ChevronRight, Info } from "@yahoo/uds-icons";
import { DeltaArrowIcon } from "./DeltaArrowIcon";
import { TrendingIcon } from "./TrendingIcon";
import { KpiSparkline } from "./KpiSparkline";

type Trend = "up" | "down" | "neutral";

export interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: Trend;
  helperText?: string;
  /** Primary = large card with sparkline; Secondary = compact card. */
  variant?: "primary" | "secondary";
  /** Time-series values for the primary card sparkline (11–12 points). */
  sparklineData?: number[];
  /** When set, the whole card links to this URL (e.g. Content performance metric page). */
  href?: string;
}

function DeltaChip({ delta, trend }: { delta: string; trend: Trend }) {
  const isUp = trend === "up";
  const isDown = trend === "down";

  const borderColor = isUp
    ? "border-[#56C470]"
    : isDown
      ? "border-[#FF4D52]"
      : "border-[#828a93]";

  const iconColor = isUp
    ? "text-[#56C470]"
    : isDown
      ? "text-[#FF4D52]"
      : "text-[#828a93]";

  const textColor = "text-[#464e56]";

  const icon =
    trend === "up" ? (
      <TrendingIcon direction="up" className={iconColor} />
    ) : trend === "down" ? (
      <TrendingIcon direction="down" className={iconColor} />
    ) : (
      <DeltaArrowIcon direction="right" className={`h-3 w-3 shrink-0 ${iconColor}`} />
    );

  return (
    <span
      className={`inline-flex min-h-[28px] items-center justify-center gap-1 overflow-hidden rounded-full border bg-white px-3 py-1 ${borderColor}`}
    >
      {icon}
      <span className={`font-yahoo-product-sans text-[14px] font-medium leading-5 ${textColor}`}>
        {delta}
      </span>
    </span>
  );
}

/**
 * Hover-triggered tooltip matching the Figma "Popover — Large, arrow=Bottom" design.
 * Dark bg (#232a31), rounded-[8px], bold label + regular description at 12px white.
 * Downward caret is centered on the info button.
 * Uses a React portal so the tooltip escapes any overflow/stacking-context constraints
 * (e.g. the sidebar clipping absolutely-positioned children).
 */
function InfoTooltip({ label, helperText }: { label: string; helperText: string }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 8,           // 8px gap above the icon
        left: rect.left + rect.width / 2, // horizontally centered on icon
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
      {/* Popover body — Figma: bg #232a31, rounded-[8px], pt-3 pb-4 px-4, gap-1 */}
      <div className="flex w-[240px] flex-col gap-1 rounded-[8px] bg-[#232a31] px-4 pb-4 pt-3 shadow-[0px_4px_16px_rgba(0,0,0,0.25)]">
        <p className="font-yahoo-product-sans text-[12px] font-medium leading-4 text-white">
          {label}
        </p>
        <p className="font-yahoo-product-sans text-[12px] font-normal leading-4 text-white/80">
          {helperText}
        </p>
      </div>
      {/* Downward caret — centered on the info button */}
      <svg
        width="16"
        height="8"
        viewBox="0 0 16 8"
        className="shrink-0"
        aria-hidden="true"
      >
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
      <span
        ref={iconRef}
        aria-label={`About ${label}`}
        className="flex items-center cursor-default"
      >
        <Icon
          name={Info}
          size="xs"
          variant="outline"
          className="h-[12px] w-[12px] shrink-0 text-[#6a6a6a]"
        />
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
  href,
}: KpiCardProps) {
  const isPrimary = variant === "primary";
  const showSparkline = isPrimary && Boolean(sparklineData?.length);
  const cardClassName =
    "relative flex min-h-[112px] items-stretch rounded-[8px] border border-[#e0e4e9] bg-[#fafafa] p-6";
  const secondaryCardClassName =
    "relative flex min-h-[104px] flex-col justify-between gap-3 rounded-[8px] border border-[#e0e4e9] bg-[#fafafa] p-6";
  const ChevronOrSpan = href ? "span" : "button";
  const chevronAriaProps = href ? {} : { type: "button" as const, "aria-label": "Open KPI detail" };

  const chevronEl = href ? (
    <ChevronOrSpan
      className="absolute right-4 top-4 inline-flex size-6 items-center justify-center rounded-full border border-[#e0e4e9] bg-transparent"
      {...chevronAriaProps}
    >
      <Icon name={ChevronRight} size="sm" variant="outline" className="w-2.5 h-2.5 text-[#6a6a6a]" />
    </ChevronOrSpan>
  ) : null;

  if (isPrimary) {
    const content = (
      <>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#464e56]">
              {label}
            </p>
            <InfoTooltip label={label} helperText={helperText ?? ""} />
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <p className="font-yahoo-product-sans text-[28px] font-bold leading-8 text-[#232a31]">
              {value}
            </p>
            {delta ? <DeltaChip delta={delta} trend={trend} /> : null}
          </div>
        </div>
        {showSparkline && sparklineData ? (
          <div className="ml-4 flex min-w-0 flex-1 items-end overflow-hidden">
            <KpiSparkline data={sparklineData} hideGradient />
          </div>
        ) : null}
        {chevronEl}
      </>
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

  const content = (
    <>
      <div className="flex items-center gap-2">
        <p className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#464e56]">
          {label}
        </p>
        <InfoTooltip label={label} helperText={helperText ?? ""} />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <p className="font-yahoo-product-sans text-[28px] font-bold leading-8 text-[#232a31]">
          {value}
        </p>
        {delta ? <DeltaChip delta={delta} trend={trend} /> : null}
      </div>
      {chevronEl}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={secondaryCardClassName} style={{ textDecoration: "none", color: "inherit" }}>
        {content}
      </Link>
    );
  }
  return <section className={secondaryCardClassName}>{content}</section>;
}
