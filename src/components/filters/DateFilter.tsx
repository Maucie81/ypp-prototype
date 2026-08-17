"use client";

import { Icon } from "@yahoo/uds";
import { ChevronDown, ChevronLeft, ChevronRight } from "@yahoo/uds-icons";
import { useId, useRef, useState } from "react";
import { useOnClickOutside } from "@/lib/useOnClickOutside";

export type PresetId = "last30" | "last14" | "last7" | "last24h" | "mtd" | "custom";

function presetLabel(preset: PresetId) {
  switch (preset) {
    case "last30":
      return "Last 30 days";
    case "last14":
      return "Last 14 days";
    case "last7":
      return "Last 7 days";
    case "last24h":
      return "Last 24 hours";
    case "mtd":
      return "Month to date";
    case "custom":
      return "Custom";
  }
}

/** Figma spec order: Last 30 days, Last 14 days, Last 7 days (default), Last 24 hours, Custom. */
const PRESET_ORDER: Exclude<PresetId, "custom">[] = ["last30", "last14", "last7", "last24h"];

export type DateFilterValue =
  | { mode: "preset"; preset: Exclude<PresetId, "custom"> }
  | {
      mode: "custom";
      startISO: string; // yyyy-mm-dd
      endISO: string; // yyyy-mm-dd
      timeHHMM: string; // 24h, applies to both start/end
      timezone: string;
    };

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DateFilter({
  trigger,
  value,
  open,
  onOpenChange,
  onChange,
}: {
  trigger: React.ReactNode;
  value: DateFilterValue;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onChange: (next: DateFilterValue) => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const [customOpen, setCustomOpen] = useState(false);

  useOnClickOutside(
    rootRef,
    () => {
      onOpenChange(false);
      setCustomOpen(false);
    },
    open || customOpen
  );

  return (
    <div ref={rootRef} className="relative">
      {trigger}

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Date options"
          className="absolute left-0 top-full z-50 mt-2 w-[240px] overflow-hidden rounded-[8px] bg-white pt-1 shadow-[0px_0px_2px_rgba(0,0,0,0.05),0px_4px_16px_rgba(0,0,0,0.2)]"
        >
          <div className="border-b border-[#f0f3f5] px-4 py-3">
            <p className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
              Date range
            </p>
          </div>

          <div className="py-1">
            {PRESET_ORDER.map((preset) => (
              <button
                key={preset}
                type="button"
                role="menuitemradio"
                aria-checked={value.mode === "preset" && value.preset === preset}
                className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-[#f5f8fa]"
                onClick={() => {
                  onChange({ mode: "preset", preset });
                  onOpenChange(false);
                }}
              >
                <span className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
                  {presetLabel(preset)}
                </span>
              </button>
            ))}

            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-[#f5f8fa]"
              onClick={() => {
                setCustomOpen(true);
                onOpenChange(false);
              }}
            >
              <span className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
                Custom
              </span>
              <Icon name={ChevronRight} size="sm" variant="outline" className="text-[#232a31]" />
            </button>
          </div>
        </div>
      ) : null}

      {customOpen ? (
        <CustomDateRangePopover
          onClose={() => setCustomOpen(false)}
          value={value.mode === "custom" ? value : null}
          onSave={(next) => {
            onChange(next);
            setCustomOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function daysInMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

function isoFromYMD(y: number, m1: number, d: number) {
  const mm = String(m1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function compareISO(a: string, b: string) {
  return a.localeCompare(b);
}

/**
 * Custom date range + time + timezone selector.
 * Design reference: Lightyear Custom Components UI kit — Custom date selector
 * https://www.figma.com/design/4KQB7uUMehkWVMXaFbGrMK?node-id=133-17898
 */
function CustomDateRangePopover({
  value,
  onClose,
  onSave,
}: {
  value: Extract<DateFilterValue, { mode: "custom" }> | null;
  onClose: () => void;
  onSave: (next: Extract<DateFilterValue, { mode: "custom" }>) => void;
}) {
  const initial = new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth0, setViewMonth0] = useState(initial.getMonth());

  const [startISO, setStartISO] = useState<string>(value?.startISO ?? "");
  const [endISO, setEndISO] = useState<string>(value?.endISO ?? "");

  // Time as separate hour (1–12), minute (00–59), AM/PM to match Figma dropdowns
  const [hour12, setHour12] = useState(() => {
    if (value?.timeHHMM) {
      const [h] = value.timeHHMM.split(":").map(Number);
      return h % 12 || 12;
    }
    return 8;
  });
  const [minute, setMinute] = useState(() => {
    if (value?.timeHHMM) {
      const [, m] = value.timeHHMM.split(":").map(Number);
      return Number.isNaN(m) ? 30 : m;
    }
    return 30;
  });
  const [meridiem, setMeridiem] = useState<"AM" | "PM">(() => {
    if (value?.timeHHMM) {
      const [h] = value.timeHHMM.split(":").map(Number);
      return h >= 12 ? "PM" : "AM";
    }
    return "AM";
  });
  const [timezone, setTimezone] = useState(value?.timezone ?? "");

  const monthLabel = new Date(viewYear, viewMonth0, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDow = new Date(viewYear, viewMonth0, 1).getDay(); // 0..6
  const monthDays = daysInMonth(viewYear, viewMonth0);

  const cells: Array<{ iso: string | null; day: number | null }> = [];
  for (let i = 0; i < firstDow; i++) cells.push({ iso: null, day: null });
  for (let d = 1; d <= monthDays; d++) {
    const iso = isoFromYMD(viewYear, viewMonth0 + 1, d);
    cells.push({ iso, day: d });
  }
  // Only as many rows as needed, not always 6
  const numCells = Math.ceil((firstDow + monthDays) / 7) * 7;
  while (cells.length < numCells) cells.push({ iso: null, day: null });

  const hasStart = Boolean(startISO);
  const hasEnd = Boolean(endISO);
  const start = hasStart && hasEnd && compareISO(startISO, endISO) > 0 ? endISO : startISO;
  const end = hasStart && hasEnd && compareISO(startISO, endISO) > 0 ? startISO : endISO;

  function onPickDay(iso: string) {
    if (!startISO || (startISO && endISO)) {
      setStartISO(iso);
      setEndISO("");
      return;
    }
    if (compareISO(iso, startISO) < 0) {
      setEndISO(startISO);
      setStartISO(iso);
      return;
    }
    setEndISO(iso);
  }

  const timeHHMM =
    hour12 >= 1 &&
    hour12 <= 12 &&
    minute >= 0 &&
    minute <= 59
      ? (() => {
          let h = meridiem === "AM" ? (hour12 === 12 ? 0 : hour12) : hour12 === 12 ? 12 : hour12 + 12;
          return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        })()
      : null;
  const canSave = Boolean(start) && Boolean(end) && Boolean(timeHHMM) && Boolean(timezone);

  const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
  const MINUTES = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div
      className="absolute left-0 top-full z-50 mt-2 w-[400px] overflow-hidden rounded-[16px] bg-white shadow-[0px_0px_1px_0px_rgba(0,0,0,0.10),0px_4px_8px_0px_rgba(0,0,0,0.10)]"
      role="dialog"
      aria-label="Custom date range"
    >
      {/* Calendar — Figma Date picker */}
      <div className="flex flex-col items-start gap-2 px-6 pb-4 pt-6">
        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            className="flex size-[36px] items-center justify-center rounded-full bg-white hover:bg-[#f5f8fa]"
            aria-label="Previous month"
            onClick={() => {
              const prev = new Date(viewYear, viewMonth0 - 1, 1);
              setViewYear(prev.getFullYear());
              setViewMonth0(prev.getMonth());
            }}
          >
            <Icon name={ChevronLeft} size="sm" variant="outline" className="text-[#232a31]" />
          </button>
          <p className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
            {monthLabel}
          </p>
          <button
            type="button"
            className="flex size-[36px] items-center justify-center rounded-full bg-white hover:bg-[#f5f8fa]"
            aria-label="Next month"
            onClick={() => {
              const next = new Date(viewYear, viewMonth0 + 1, 1);
              setViewYear(next.getFullYear());
              setViewMonth0(next.getMonth());
            }}
          >
            <Icon name={ChevronRight} size="sm" variant="outline" className="text-[#232a31]" />
          </button>
        </div>

        <div className="flex w-full py-2 font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#464e56]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <p key={d} className="flex-1 text-center">
              {d}
            </p>
          ))}
        </div>

        <div className="grid w-full grid-cols-7 gap-y-1">
          {cells.map((c, idx) => {
            if (!c.iso || !c.day)
              return <div key={`e-${idx}`} className="flex h-[36px] items-center justify-center" />;

            const isStart = c.iso === start;
            const isEnd = c.iso === end;
            const inRange =
              Boolean(start) && Boolean(end) && compareISO(c.iso, start) >= 0 && compareISO(c.iso, end) <= 0;

            return (
              <button
                key={c.iso}
                type="button"
                className={`flex h-[36px] items-center justify-center py-[6px] ${
                  inRange ? "bg-[#ebe5ff]" : ""
                }`}
                onClick={() => onPickDay(c.iso!)}
              >
                <span
                  className={`flex size-[36px] items-center justify-center rounded-full font-yahoo-product-sans text-[14px] leading-5 ${
                    isStart || isEnd
                      ? "bg-[#d5cfff] font-medium text-[#232a31]"
                      : "font-normal text-[#232a31] hover:bg-[#f5f8fa]"
                  }`}
                >
                  {c.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider between calendar and time sections */}
      <div className="h-px w-full bg-[#f0f3f5]" />

      {/* Time — Figma: three dropdowns (Hour : Minute : AM/PM), border tertiary, rounded-sm, p-4 */}
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-col gap-2.5">
          <p className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#464e56]">
            Time
          </p>
          {/* Hour+Minute are grouped (8px gap), AM/PM is separated (16px gap) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center rounded-[4px] border border-[#828a93] bg-white px-4 py-4">
                <select
                  value={hour12}
                  onChange={(e) => setHour12(Number(e.target.value))}
                  className="w-[28px] appearance-none bg-transparent font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31] outline-none"
                  aria-label="Hour"
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <Icon name={ChevronDown} size="sm" variant="outline" className="shrink-0 text-[#232a31]" />
              </div>
              <span className="font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#232a31]">:</span>
              <div className="relative flex items-center rounded-[4px] border border-[#828a93] bg-white px-4 py-4">
                <select
                  value={minute}
                  onChange={(e) => setMinute(Number(e.target.value))}
                  className="w-[28px] appearance-none bg-transparent font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31] outline-none"
                  aria-label="Minute"
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <Icon name={ChevronDown} size="sm" variant="outline" className="shrink-0 text-[#232a31]" />
              </div>
            </div>
            <div className="relative flex items-center rounded-[4px] border border-[#828a93] bg-white px-4 py-4">
              <select
                value={meridiem}
                onChange={(e) => setMeridiem(e.target.value as "AM" | "PM")}
                className="w-[32px] appearance-none bg-transparent font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31] outline-none"
                aria-label="AM/PM"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
              <Icon name={ChevronDown} size="sm" variant="outline" className="shrink-0 text-[#232a31]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#464e56]">
            Time zone <span className="text-[#d30d2e]">*</span>
          </p>
          <div className="relative flex items-center gap-3 rounded-[4px] border border-[#828a93] bg-white p-4">
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="min-w-0 flex-1 appearance-none bg-transparent font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31] outline-none"
              aria-label="Time zone"
              aria-required
            >
              <option value="">Select time zone</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Los Angeles, PT</option>
              <option value="UTC">UTC</option>
            </select>
            <Icon name={ChevronDown} size="sm" variant="outline" className="shrink-0 text-[#232a31]" />
          </div>
        </div>
      </div>

      {/* Footer — Figma: Cancel | Current time | Select (tertiary + tertiary + primary, py-5 px-6) */}
      <div className="flex items-center justify-between px-6 py-5">
        <button
          type="button"
          className="rounded-full bg-transparent px-4 py-1.5 font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31] hover:bg-[#f5f8fa]"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-full bg-transparent px-4 py-1.5 font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31] hover:bg-[#f5f8fa]"
          onClick={() => {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            setHour12(h % 12 || 12);
            setMinute(m);
            setMeridiem(h >= 12 ? "PM" : "AM");
          }}
        >
          Current time
        </button>
        <button
          type="button"
          className={`min-w-[104px] rounded-full px-4 py-1.5 font-yahoo-product-sans text-[14px] font-medium leading-5 ${
            canSave
              ? "bg-[#5D5EFF] text-white hover:bg-[#4A4BE8]"
              : "cursor-not-allowed bg-[#f0f3f5] text-[#98a2b3]"
          }`}
          disabled={!canSave}
          onClick={() => {
            if (!timeHHMM) return;
            onSave({
              mode: "custom",
              startISO: start,
              endISO: end,
              timeHHMM,
              timezone,
            });
            onClose();
          }}
        >
          Select
        </button>
      </div>
    </div>
  );
}

