import { Icon } from "@yahoo/uds";
import { ChevronDown, Cross } from "@yahoo/uds-icons";

type FilterChipVariant = "applied" | "dropdown";

export function FilterChip({
  label,
  count,
  variant,
  isOpen,
  controlsId,
  onClick,
  onClear,
}: {
  label: string;
  /** Number of selected items — shows a badge pill instead of an X when > 0 */
  count?: number;
  variant: FilterChipVariant;
  isOpen?: boolean;
  controlsId?: string;
  onClick?: () => void;
  onClear?: () => void;
}) {
  const isApplied = variant === "applied";
  const hasCount = typeof count === "number" && count > 0;
  // Multi-select active = has count badge + chevron
  // Date / single-select active = label + X clear button
  const showBadge = hasCount;
  const showX = isApplied && !hasCount;
  const showChevron = !isApplied || hasCount;

  return (
    <div
      className={`inline-flex h-9 items-center rounded-full border px-4 py-2 ${
        isApplied || hasCount
          ? "gap-1 border-[#2c363f] bg-white hover:bg-[#f0f3f5] active:bg-[#e0e4e9]"
          : "gap-2 border-[#e0e4e9] bg-white hover:bg-[#f5f8fa] active:bg-[#e0e4e9]"
      }`}
    >
      {/* Main trigger */}
      <button
        type="button"
        className="inline-flex items-center gap-1.5 outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={controlsId}
        onClick={onClick}
      >
        <span className="whitespace-nowrap font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
          {label}
        </span>

        {/* Count badge — gray pill with +N */}
        {showBadge && (
          <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-[#c7cdd2] px-1.5 py-px font-yahoo-product-sans text-[13px] font-medium leading-4 text-[#232a31]">
            +{count}
          </span>
        )}

        {/* Chevron for dropdown or multi-select applied */}
        {showChevron && (
          <Icon
            name={ChevronDown}
            size="sm"
            variant="outline"
            className={`shrink-0 text-[#464e56] transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* X clear — only for date / single-select applied */}
      {showX && onClear && (
        <button
          type="button"
          className="inline-flex items-center justify-center outline-none"
          aria-label={`Clear ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <Icon name={Cross} size="sm" variant="outline" className="text-[#464e56]" />
        </button>
      )}
    </div>
  );
}

