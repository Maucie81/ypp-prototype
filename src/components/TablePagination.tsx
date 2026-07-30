"use client";

import { useRef, useState } from "react";
import { Icon } from "@yahoo/uds";
import { ChevronDown, LeftPageArrow, RightPageArrow } from "@yahoo/uds-icons";
import { useOnClickOutside } from "@/lib/useOnClickOutside";
import { DeltaArrowIcon } from "@/components/DeltaArrowIcon";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Lightyear-style pagination: Show [n] dropdown (10/25/50/100), row range text,
 * then first/prev/page input/next/last on the right. Figma: 4KQB7uUMehkWVMXaFbGrMK, node 159:62224.
 */
export function TablePagination({
  totalRows,
  pageSize = 10,
  currentPage = 1,
  onPageSizeChange,
  onPageChange,
  embedded = false,
}: {
  totalRows: number;
  pageSize?: number;
  currentPage?: number;
  onPageSizeChange?: (size: number) => void;
  onPageChange?: (page: number) => void;
  /** When true, omit top border and top margin for use inside a table container */
  embedded?: boolean;
}) {
  const [showOpen, setShowOpen] = useState(false);
  const showRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(showRef, () => setShowOpen(false), showOpen);

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <div
      className={`flex flex-wrap items-center gap-4 ${embedded ? "pt-4 pb-2" : "mt-4 border-t border-[#f0f3f5] pt-4"}`}
    >
      <div ref={showRef} className="relative flex items-center gap-2">
        <span className="font-yahoo-product-sans text-[13px] text-[#6e7780]">
          Show
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowOpen((v) => !v)}
            aria-expanded={showOpen}
            aria-haspopup="listbox"
            aria-label="Rows per page"
            className="inline-flex h-8 min-w-[56px] items-center justify-between gap-2 rounded border border-[#828a93] bg-white px-3 font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31] hover:bg-[#f5f8fa]"
          >
            {pageSize}
            <Icon name={ChevronDown} size="sm" variant="outline" className="h-3.5 w-3.5 shrink-0 text-[#6e7780]" />
          </button>
          {showOpen && (
            <ul
              role="listbox"
              className="absolute bottom-full left-1/2 z-50 mb-1 min-w-[56px] -translate-x-1/2 overflow-hidden rounded border border-[#e0e4e9] bg-white py-1 shadow-[0px_4px_16px_rgba(0,0,0,0.2)]"
            >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <li key={size} role="option" aria-selected={pageSize === size}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31] hover:bg-[#f5f8fa]"
                  onClick={() => {
                    onPageSizeChange?.(size);
                    setShowOpen(false);
                  }}
                >
                  {size}
                </button>
              </li>
            ))}
            </ul>
          )}
        </div>
      </div>

      <span className="font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31]">
        {startRow.toLocaleString("en-US")} – {endRow.toLocaleString("en-US")} of{" "}
        {totalRows.toLocaleString("en-US")} rows
      </span>

      {/* Page nav: arrows only (no circles), compact input, tight spacing */}
      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          aria-label="First page"
          className="inline-flex size-8 shrink-0 items-center justify-center text-[#464e56] hover:text-[#232a31] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(1)}
        >
          <Icon name={LeftPageArrow} size="xs" variant="outline" className="size-3 shrink-0 text-current" />
        </button>
        <button
          type="button"
          aria-label="Previous page"
          className="inline-flex size-8 shrink-0 items-center justify-center text-[#464e56] hover:text-[#232a31] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        >
          <DeltaArrowIcon direction="left" className="size-3 shrink-0 text-current" />
        </button>

        <div className="flex items-center gap-1.5">
          <input
            type="text"
            inputMode="numeric"
            aria-label="Current page"
            className="h-7 min-w-[2rem] w-9 max-w-[2.5rem] rounded-[4px] border border-[#828a93] bg-white px-1 text-center font-yahoo-product-sans text-[13px] font-normal leading-4 text-[#232a31] outline-none focus:border-[#6e7780]"
            value={currentPage}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!Number.isNaN(n) && n >= 1 && n <= totalPages) {
                onPageChange?.(n);
              }
            }}
          />
          <span className="font-yahoo-product-sans text-[13px] font-normal leading-4 text-[#232a31]">
            of {totalPages.toLocaleString("en-US")} pages
          </span>
        </div>

        <button
          type="button"
          aria-label="Next page"
          className="inline-flex size-8 shrink-0 items-center justify-center text-[#464e56] hover:text-[#232a31] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        >
          <DeltaArrowIcon direction="right" className="size-3 shrink-0 text-current" />
        </button>
        <button
          type="button"
          aria-label="Last page"
          className="inline-flex size-8 shrink-0 items-center justify-center text-[#464e56] hover:text-[#232a31] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(totalPages)}
        >
          <Icon name={RightPageArrow} size="xs" variant="outline" className="size-3 shrink-0 text-current" />
        </button>
      </div>
    </div>
  );
}
