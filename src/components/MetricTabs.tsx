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
            className={`flex items-start py-3 ${
              isActive ? "border-b-4 border-[#7d2eff]" : "border-b-4 border-transparent"
            }`}
          >
            <span
              className={`font-yahoo-product-sans text-[14px] font-medium leading-5 ${
                isActive ? "text-[#232a31]" : "text-[#464e56]"
              }`}
            >
              {TAB_LABELS[tab]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

