"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const PAGE_HEADER_HEIGHT_VAR = "--page-header-height";

/**
 * Page header pattern for all app pages.
 * Design reference: Partner Portal — Page header
 * https://www.figma.com/design/ChYlx1SqcGFnjxy6Khtst3?node-id=12101-348667
 *
 * Structure: optional breadcrumbs → title row (title + optional actions) → optional slot (e.g. filter chips).
 * Exposes --page-header-height on document for sticky siblings (e.g. tab nav docking 32px below).
 */
export function PageHeader({
  breadcrumbs,
  title,
  titleClassName,
  description,
  actions,
  children,
  sticky = true,
  slotClassName,
}: {
  breadcrumbs?: { label: string; href?: string }[];
  title: string;
  titleClassName?: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  /** When false, header is not sticky (e.g. when wrapped in a parent sticky container). */
  sticky?: boolean;
  /** Optional class for the slot that wraps children (e.g. filter bar). Default: 16px padding below. */
  slotClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sticky) return;
    const el = ref.current;
    if (!el) return;
    const setHeight = () => {
      document.documentElement.style.setProperty(PAGE_HEADER_HEIGHT_VAR, `${el.offsetHeight}px`);
    };
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty(PAGE_HEADER_HEIGHT_VAR);
    };
  }, [sticky]);

  return (
    <div
      ref={ref}
      className={`flex w-full flex-col bg-white ${sticky ? "sticky top-0 z-10" : ""}`}
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="flex flex-col gap-4 bg-white py-6" style={{ backgroundColor: "#ffffff" }}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-0 font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]"
          >
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <span className="px-2.5 font-normal">&gt;</span>}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1
              className={
                titleClassName ??
                "font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#232a31]"
              }
            >
              {title}
            </h1>
            {description && (
              <p className="mt-1 font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#464e56] max-w-xl">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-3">{actions}</div>
          )}
        </div>
      </div>

      {children && (
        <div
          className={`flex flex-wrap items-center gap-4 bg-white pb-4 ${slotClassName ?? ""}`}
          style={{ backgroundColor: "#ffffff" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
