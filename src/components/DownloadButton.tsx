"use client";

import { useCallback, useRef, useState } from "react";
import { Icon } from "@yahoo/uds";
import { Download } from "@yahoo/uds-icons";

const MENU_ITEMS = [
  { label: "Open in Google Sheets" },
  { label: "Download .xls" },
  { label: "Download .csv" },
  { label: "Download .pdf" },
];

export function DownloadButton() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger — expands from circle to pill on hover */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? undefined : "Download"}
        className={`inline-flex items-center justify-center rounded-full border border-[#e0e4e9] bg-white transition-all duration-200 ease-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d2eff] focus-visible:ring-offset-2 ${
          open ? "h-8 pl-3 pr-3.5" : "size-8"
        }`}
      >
        <Icon
          name={Download}
          size="sm"
          variant="outline"
          className="w-3.5 h-3.5 shrink-0 text-[#6a6a6a]"
        />
        {/* Label slides in when open */}
        <span
          className={`overflow-hidden whitespace-nowrap font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31] transition-all duration-200 ease-out ${
            open ? "ml-1.5 max-w-[80px] opacity-100" : "ml-0 max-w-0 opacity-0"
          }`}
        >
          Export
        </span>
      </button>

      {/* Dropdown menu */}
      <div
        role="menu"
        aria-label="Export options"
        className={`absolute right-0 top-[calc(100%+6px)] z-50 w-[240px] overflow-hidden rounded-[8px] bg-white py-1 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.05),0px_4px_16px_0px_rgba(0,0,0,0.2)] transition-all duration-150 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {MENU_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className="flex h-10 w-full items-center px-4 text-left font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] hover:bg-[#f5f8fa]"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
