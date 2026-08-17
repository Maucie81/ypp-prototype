"use client";

import { Icon } from "@yahoo/uds";
import { Check, MagnifyingGlass } from "@yahoo/uds-icons";
import { ReactNode, useId, useMemo, useRef, useState } from "react";
import { useOnClickOutside } from "@/lib/useOnClickOutside";

export type MultiSelectOption = {
  id: string;
  label: string;
  description?: string;
};

export function MultiSelectDropdown({
  trigger,
  label,
  options,
  selectedIds,
  open,
  onOpenChange,
  onToggleId,
  onClear,
  searchable,
}: {
  trigger: ReactNode;
  label: string;
  options: MultiSelectOption[];
  selectedIds: string[];
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onToggleId: (id: string) => void;
  onClear: () => void;
  searchable?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const [query, setQuery] = useState("");

  useOnClickOutside(
    rootRef,
    () => {
      onOpenChange(false);
    },
    open
  );

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const visibleOptions = useMemo(() => {
    if (!searchable) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  return (
    <div ref={rootRef} className="relative">
      {trigger}

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={`${label} options`}
          className="absolute left-0 top-full z-50 mt-2 w-[240px] overflow-hidden rounded-[8px] bg-white pt-1 shadow-[0px_0px_2px_rgba(0,0,0,0.05),0px_4px_16px_rgba(0,0,0,0.2)]"
        >
          {searchable ? (
            <div className="px-4 py-2">
              <div className="flex h-10 items-center gap-3 rounded-full bg-[#f0f3f5] pl-4 pr-6">
                <Icon name={MagnifyingGlass} size="sm" variant="outline" className="shrink-0 text-[#232a31]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] placeholder:text-[#6e7780] outline-none"
                />
              </div>
            </div>
          ) : null}

          <div className="max-h-[280px] overflow-y-auto py-1">
            {visibleOptions.map((opt) => {
              const checked = selectedSet.has(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={checked}
                  className="flex w-full min-h-[40px] items-center gap-3 px-4 py-2 text-left hover:bg-[#f5f8fa]"
                  onClick={() => {
                    onToggleId(opt.id);
                  }}
                >
                  <span
                    className={`flex size-4 items-center justify-center rounded-[2px] border ${
                      checked
                        ? "border-[#232a31] bg-[#232a31]"
                        : "border-[#98a2b3] bg-white"
                    }`}
                    aria-hidden
                  >
                    {checked ? (
                      <Icon name={Check} size="xs" variant="outline" className="text-white" />
                    ) : null}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31]">
                      {opt.label}
                    </span>
                    {opt.description ? (
                      <span className="font-yahoo-product-sans text-[12px] font-normal leading-4 text-[#6e7780]">
                        {opt.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="sticky bottom-0 bg-white px-4 py-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="rounded-full px-3 py-2 font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31] hover:bg-[#f5f8fa]"
                onClick={() => {
                  onClear();
                }}
              >
                Clear
              </button>
              <button
                type="button"
                className="rounded-full bg-[#5D5EFF] px-5 py-2 font-yahoo-product-sans text-[14px] font-medium leading-5 text-white hover:bg-[#4A4BE8]"
                onClick={() => onOpenChange(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

