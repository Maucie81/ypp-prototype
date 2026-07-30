"use client";

import { useRef, useState } from "react";
import { Icon } from "@yahoo/uds";
import { Cross, ChevronDown } from "@yahoo/uds-icons";
import { useOnClickOutside } from "@/lib/useOnClickOutside";

const DELETE_REASONS = [
  "Legal/rights issue",
  "Factual error",
  "Embargo violation",
  "Contains personal information",
  "Content quality issue",
  "Destination name",
  "Duplicate Content",
  "Wrong Feed",
  "Outdated",
  "Other",
];

export function DeleteContentDialog({
  open,
  contentTypeLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  contentTypeLabel: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(selectRef, () => setMenuOpen(false), menuOpen);

  if (!open) return null;

  function handleCancel() {
    setReason(null);
    setMenuOpen(false);
    onCancel();
  }

  function handleConfirm() {
    if (!reason) return;
    onConfirm(reason);
    setReason(null);
    setMenuOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleCancel} aria-hidden="true" />

      <div
        className="relative z-10 flex w-full max-w-[400px] flex-col rounded-[16px] bg-white"
        style={{
          boxShadow: "0px 0px 16px rgba(0,0,0,0.05), 0px 32px 32px -20px rgba(0,0,0,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 py-6 pl-6 pr-3.5">
          <h2 className="font-yahoo-product-sans text-[18px] font-bold leading-6 text-[#232a31]">
            Delete {contentTypeLabel}?
          </h2>
          <button
            onClick={handleCancel}
            className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#f0f3f5]"
            aria-label="Close"
          >
            <Icon name={Cross} size="sm" variant="outline" className="size-4 text-[#464e56]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 px-6 pb-6">
          <div ref={selectRef} className="relative flex flex-col gap-2.5">
            <div className="flex items-center gap-1">
              <span className="font-yahoo-product-sans text-[14px] font-medium text-[#464e56]">
                Description
              </span>
              <span className="font-yahoo-product-sans text-[14px] font-medium text-[#d30d2e]">
                *
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-3 rounded-[4px] border border-[#828a93] bg-white p-4 text-left transition-colors hover:border-[#464e56]"
            >
              <span className="font-yahoo-product-sans text-[14px] text-[#232a31]">
                {reason ?? "Please select reason"}
              </span>
              <Icon
                name={ChevronDown}
                size="xs"
                variant="outline"
                className={`size-4 shrink-0 text-[#6e7780] transition-transform duration-150 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full z-50 mt-2 max-h-[280px] w-full overflow-y-auto rounded-[8px] bg-white py-1 shadow-[0px_0px_2px_rgba(0,0,0,0.05),0px_4px_16px_rgba(0,0,0,0.2)]"
              >
                {DELETE_REASONS.map((r, i) => (
                  <div key={r}>
                    {i === 5 && <div className="my-1 border-t border-[#f0f3f5]" />}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setReason(r);
                        setMenuOpen(false);
                      }}
                      className="flex min-h-[40px] w-full items-center px-4 py-2 text-left font-yahoo-product-sans text-[14px] text-[#232a31] hover:bg-[#f5f8fa]"
                    >
                      {r}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full border border-[#e0e4e9] bg-white px-5 py-2 font-yahoo-product-sans text-[14px] font-medium text-[#232a31] transition-colors hover:bg-[#f5f8fa]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!reason}
              onClick={handleConfirm}
              className={`rounded-full px-5 py-2 font-yahoo-product-sans text-[14px] font-medium text-white transition-colors ${
                reason ? "bg-[#7d2eff] hover:bg-[#6b22e8]" : "cursor-not-allowed bg-[#7d2eff] opacity-30"
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
