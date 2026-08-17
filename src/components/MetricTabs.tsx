"use client";

export type MetricTab = "views" | "reach" | "uniques" | "dwell" | "comments" | "ctr";

const TAB_LABELS: Record<MetricTab, string> = {
  views: "Views",
  reach: "Reach",
  uniques: "Uniques",
  dwell: "Dwell",
  comments: "Comments",
  ctr: "CTR",
};

export function MetricTabs({
  value,
  onChange,
}: {
  value: MetricTab;
  onChange: (next: MetricTab) => void;
}) {
  const tabs = Object.keys(TAB_LABELS) as MetricTab[];

  return (
    <div className="sticky top-0 z-10 flex items-center gap-6 border-b border-[#f0f3f5] bg-white">
      {tabs.map((tab) => {
        const isActive = tab === value;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className="group relative flex items-start py-3 transition-colors"
          >
            <span
              className={`font-yahoo-product-sans text-[14px] leading-5 transition-all ${
                isActive
                  ? "font-medium text-[#232a31]"
                  : "font-medium text-[#464e56] group-hover:font-semibold group-hover:text-[#232a31]"
              }`}
            >
              {TAB_LABELS[tab]}
            </span>
            <span
              className={`absolute bottom-0 left-0 h-1 w-full rounded-full ${
                isActive ? "bg-[#7d2eff]" : "bg-transparent"
              }`}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}

