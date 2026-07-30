"use client";

import { Icon, type IconProps } from "@yahoo/uds";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Cog,
  Cross,
  FlameTorch,
  Graph,
  LayoutGrid,
  MagnifyingGlass,
  Sync,
} from "@yahoo/uds-icons";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { DeltaArrowIcon } from "@/components/DeltaArrowIcon";
import { useOnClickOutside } from "@/lib/useOnClickOutside";

// ─── Business / Brand data ────────────────────────────────────────────────────

type Brand = { id: string; name: string; color: string };
type Business = { id: string; name: string; category: string; brands: Brand[] };

const DATAPULSE_BRAND: Brand = { id: "datapulse-main", name: "Datapulse Media", color: "#6A6A6A" };

const BUSINESSES: Business[] = [
  {
    id: "datapulse",
    name: "Datapulse Media",
    category: "Publisher",
    brands: [
      DATAPULSE_BRAND,
      { id: "datapulse-sports", name: "Datapulse Sports", color: "#0099FF" },
      { id: "datapulse-tech", name: "Datapulse Tech", color: "#22a861" },
      { id: "datapulse-news", name: "Datapulse News", color: "#FF6B35" },
      { id: "datapulse-finance", name: "Datapulse Finance", color: "#FFA700" },
      { id: "datapulse-lifestyle", name: "Datapulse Lifestyle", color: "#CC008C" },
    ],
  },
  {
    id: "gannett",
    name: "Gannett",
    category: "Business",
    brands: [
      { id: "usa-today", name: "USA TODAY", color: "#0099FF" },
      { id: "azcentral", name: "AZCentral | The Arizona Republic", color: "#FF6B35" },
      { id: "freep", name: "Detroit Free Press", color: "#CC008C" },
      { id: "indystar", name: "IndyStar", color: "#7D2EFF" },
      { id: "detroit-news", name: "The Detroit News", color: "#FFA700" },
      { id: "akron", name: "Akron Beacon Journal", color: "#0099FF" },
      { id: "amarillo", name: "Amarillo Globe-News", color: "#7D2EFF" },
      { id: "american-news", name: "American News", color: "#FFA700" },
      { id: "asheville", name: "Asheville Citizen-Times", color: "#e03d2e" },
      { id: "athens", name: "Athens Banner-Herald", color: "#22a861" },
      { id: "auburn", name: "Auburn Wire", color: "#0099FF" },
      { id: "austin", name: "Austin American-Statesman", color: "#7D2EFF" },
      { id: "app-com", name: "App.com | Asbury Park Press", color: "#CC008C" },
      { id: "burlington", name: "Burlington Free Press", color: "#22a861" },
      { id: "cincinnati", name: "The Cincinnati Enquirer", color: "#e03d2e" },
      { id: "courier-journal", name: "Louisville Courier Journal", color: "#0099FF" },
    ],
  },
];

// ─── BusinessSearch ───────────────────────────────────────────────────────────

function BrandAvatar({ brand, colorOverride }: { brand: Brand; colorOverride?: string }) {
  return (
    <span
      className="flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
      style={{ backgroundColor: colorOverride ?? brand.color }}
      aria-hidden
    >
      {brand.name.charAt(0)}
    </span>
  );
}

function BusinessSearch({
  selected,
  onSelect,
}: {
  selected: Brand | null;
  onSelect: (brand: Brand) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(rootRef, () => {
    setOpen(false);
    setQuery("");
  }, open);

  function handleOpen() {
    setOpen(true);
    // defer so the input is mounted first
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleSelect(brand: Brand) {
    onSelect(brand);
    setOpen(false);
    setQuery("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect(DATAPULSE_BRAND);
    setQuery("");
    setOpen(false);
  }

  const business = BUSINESSES[0];
  // Exclude currently selected item from the list; when a sub-brand is selected,
  // Datapulse Media (publisher) naturally appears as a selectable row
  const filtered = business.brands.filter((b) =>
    b.id !== selected?.id &&
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  // Header subtitle: "Publisher" when the publisher itself is selected, "Brand" otherwise
  const headerSubtitle = selected?.id === DATAPULSE_BRAND.id ? business.category : "Brand";

  return (
    <div ref={rootRef} className="relative w-full">
      {/* Trigger / search chip */}
      <div
        className={`flex h-9 w-full items-center gap-2 rounded-full border px-4 transition-colors ${
          open
            ? "border-[#232a31] bg-white ring-2 ring-[#232a31]/10"
            : "border-[#232a31] bg-transparent hover:bg-transparent cursor-pointer"
        }`}
        onClick={!open ? handleOpen : undefined}
        role={!open ? "button" : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Search businesses"
      >
        {open ? (
          <>
            <Icon name={MagnifyingGlass} size="sm" variant="outline" className="shrink-0 text-[#828a93]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31] placeholder:text-[#828a93] outline-none"
              aria-label="Search publishers"
            />
            <button
              type="button"
              onClick={() => { setOpen(false); setQuery(""); }}
              className="flex shrink-0 items-center justify-center rounded-full hover:bg-[#f5f8fa]"
              aria-label="Close search"
            >
              <Icon name={Cross} size="sm" variant="outline" className="text-[#464e56]" />
            </button>
          </>
        ) : (
          <>
            {selected ? (
              <>
                <BrandAvatar brand={selected} />
                <span className="min-w-0 flex-1 truncate font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
                  {selected.name}
                </span>
                <span className="flex shrink-0 items-center justify-center" aria-hidden>
                  <Icon name={ChevronDown} size="sm" variant="outline" className="text-[#464e56]" />
                </span>
              </>
            ) : (
              <>
                <span className="min-w-0 flex-1 font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#828a93]">
                  Search
                </span>
                <Icon name={ChevronDown} size="sm" variant="outline" className="shrink-0 text-[#464e56]" />
              </>
            )}
          </>
        )}
      </div>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          aria-label="Available publishers"
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-[311px] overflow-hidden rounded-[16px] bg-white shadow-[0px_0px_1px_0px_rgba(0,0,0,0.10),0px_4px_8px_0px_rgba(0,0,0,0.10)]"
        >
          {/* Selected header row — shows currently selected item with checkmark */}
          <div className="border-b border-[#f0f3f5] px-5 py-3">
            <div className="flex items-center gap-3">
              <BrandAvatar brand={selected ?? DATAPULSE_BRAND} />
              <div className="min-w-0 flex-1">
                <p className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
                  {selected?.name ?? business.name}
                </p>
                <p className="font-yahoo-product-sans text-[12px] font-normal leading-4 text-[#464e56]">
                  {headerSubtitle}
                </p>
              </div>
              <Icon name={Check} size="sm" variant="outline" className="shrink-0 text-[#232a31]" />
            </div>
          </div>

          {/* Brand list */}
          <div
            className="max-h-[400px] overflow-y-auto py-2"
            role="group"
            aria-label="Brands"
          >
            {filtered.length === 0 ? (
              <p className="px-5 py-3 font-yahoo-product-sans text-[13px] text-[#828a93]">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              filtered.map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  role="option"
                  aria-selected={selected?.id === brand.id}
                  className="flex h-9 w-full items-center gap-3 pl-[44px] pr-5 text-left hover:bg-[#f5f8fa]"
                  onClick={() => handleSelect(brand)}
                >
                  <BrandAvatar brand={brand} />
                  <span className="min-w-0 flex-1 truncate font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31]">
                    {brand.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Nav item types ───────────────────────────────────────────────────────────

type SubItemLink = {
  label: string;
  href: string;
};

type TopItem = {
  href: string;
  label: string;
  icon: IconProps["name"];
  subItems?: SubItemLink[];
  hasChevron?: boolean;
};

const CONTENT_PERFORMANCE_SUB: SubItemLink[] = [
  { label: "Top content", href: "/kpi/top-content" },
  { label: "Views", href: "/kpi?metric=views" },
  { label: "Visitors", href: "/kpi?metric=visitors" },
  { label: "Reach", href: "/kpi?metric=reach" },
  { label: "Uniques", href: "/kpi?metric=uniques" },
  { label: "Dwell", href: "/kpi?metric=dwell" },
  { label: "Comments", href: "/kpi?metric=comments" },
  { label: "CTR", href: "/kpi?metric=ctr" },
  { label: "Video", href: "/kpi?metric=video" },
];

const BUSINESS_SETTINGS_SUB: SubItemLink[] = [
  { label: "User management", href: "/settings/user-management" },
];

const NAV_MAIN: TopItem[] = [
  {
    href: "/",
    label: "Overview",
    icon: LayoutGrid,
  },
  {
    href: "/kpi",
    label: "Content performance",
    icon: Graph,
    hasChevron: true,
    subItems: CONTENT_PERFORMANCE_SUB,
  },
  {
    href: "/feed-health",
    label: "Feed health",
    icon: Sync,
  },
];

const NAV_BELOW: TopItem[] = [
  {
    href: "/settings",
    label: "Business settings",
    icon: Cog,
    hasChevron: true,
    subItems: BUSINESS_SETTINGS_SUB.map((s) => ({ label: s.label, href: s.href })),
  },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set());
  const [selectedBrand, setSelectedBrand] = useState<Brand>(DATAPULSE_BRAND);

  function isParentActive(item: TopItem) {
    if (item.href === "/") return pathname === "/" || pathname === "/overview";
    return pathname.startsWith(item.href);
  }

  function toggleExpanded(href: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }

  function isSubItemActive(sub: SubItemLink): boolean {
    if (pathname === "/kpi/top-content") return sub.href === "/kpi/top-content";
    if (pathname.startsWith("/settings/user-management"))
      return sub.href === "/settings/user-management";
    if (pathname !== "/kpi") return false;
    const currentMetric = searchParams.get("metric");
    if (!currentMetric) return sub.label === "Views";
    const subMetric = sub.href.includes("metric=")
      ? sub.href.split("metric=")[1]?.split("&")[0] ?? ""
      : "";
    return subMetric === currentMetric;
  }

  function renderItem(item: TopItem) {
    const active = isParentActive(item);
    const hasSub = Boolean(item.subItems?.length);
    const expanded = !collapsed && hasSub && expandedKeys.has(item.href);

    if (collapsed) {
      return (
        <Link
          key={item.href}
          href={item.href}
          className="relative flex h-12 w-full items-center justify-center"
          aria-label={item.label}
          title={item.label}
          onClick={() => setExpandedKeys(new Set())}
        >
          {active && (
            <span
              className="absolute left-0 top-[14px] h-5 w-0.5 rounded-[2px] bg-[#232a31]"
              aria-hidden
            />
          )}
          <Icon
            name={item.icon}
            size="sm"
            variant="outline"
            className={`shrink-0 ${active ? "text-[#232a31]" : "text-[#464e56]"}`}
          />
        </Link>
      );
    }

    return (
      <div key={item.href} className="w-full">
        {/* Top-level row: link or expand-only button + optional chevron */}
        <div className="relative flex w-full items-center gap-2.5 px-5 py-3.5">
          {item.hasChevron && hasSub ? (
            <button
              type="button"
              onClick={() => toggleExpanded(item.href)}
              className="flex min-w-0 flex-1 items-center gap-2.5 outline-none text-left"
              aria-expanded={expanded}
              aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
            >
              {active && (
                <span
                  className="absolute left-0 top-[14px] h-5 w-0.5 rounded-[2px] bg-[#232a31]"
                  aria-hidden
                />
              )}
              <Icon
                name={item.icon}
                size="sm"
                variant="outline"
                className={`shrink-0 ${active ? "text-[#232a31]" : "text-[#464e56]"}`}
              />
              <span className="min-w-0 flex-1 truncate">
                <span
                  className={`font-yahoo-product-sans text-[14px] leading-5 ${
                    active ? "font-medium text-[#232a31]" : "font-normal text-[#464e56]"
                  }`}
                >
                  {item.label}
                </span>
              </span>
            </button>
          ) : (
            <Link
              href={item.href}
              className="flex min-w-0 flex-1 items-center gap-2.5 outline-none"
              onClick={() => setExpandedKeys(new Set())}
            >
              {active && (
                <span
                  className="absolute left-0 top-[14px] h-5 w-0.5 rounded-[2px] bg-[#232a31]"
                  aria-hidden
                />
              )}
              <Icon
                name={item.icon}
                size="sm"
                variant="outline"
                className={`shrink-0 ${active ? "text-[#232a31]" : "text-[#464e56]"}`}
              />
              <span className="min-w-0 flex-1 truncate">
                <span
                  className={`font-yahoo-product-sans text-[14px] leading-5 ${
                    active ? "font-medium text-[#232a31]" : "font-normal text-[#464e56]"
                  }`}
                >
                  {item.label}
                </span>
              </span>
            </Link>
          )}
          {item.hasChevron && hasSub ? (
            <button
              type="button"
              onClick={() => toggleExpanded(item.href)}
              className="flex shrink-0 items-center justify-center rounded p-1 text-[#464e56] hover:bg-[#f5f8fa] hover:text-[#232a31]"
              aria-expanded={expanded}
              aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
            >
              {expanded ? (
                <Icon name={ChevronUp} size="sm" variant="outline" />
              ) : (
                <Icon name={ChevronDown} size="sm" variant="outline" />
              )}
            </button>
          ) : null}
        </div>

        {/* Sub-items, shown when parent is expanded */}
        {expanded &&
          item.subItems?.map((sub) => {
            const subActive = isSubItemActive(sub);
            return (
              <Link
                key={sub.label}
                href={sub.href}
                className={`flex h-11 w-full items-center py-3 pl-[45px] pr-5 ${
                  subActive ? "bg-[#f0f3f5]" : "bg-white hover:bg-[#f5f8fa]"
                }`}
              >
                <span
                  className={`font-yahoo-product-sans text-[14px] leading-5 ${
                    subActive
                      ? "font-medium text-[#232a31]"
                      : "font-normal text-[#464e56]"
                  }`}
                >
                  {sub.label}
                </span>
              </Link>
            );
          })}
      </div>
    );
  }

  return (
    <aside
      className={`hidden h-full flex-col border-r border-[#f5f5f5] bg-white pb-4 pt-6 md:flex ${
        collapsed ? "w-[52px] overflow-hidden" : "w-[252px]"
      }`}
      aria-label="Side navigation"
    >
      {/* Publisher / business search */}
      {collapsed ? (
        <div className="flex shrink-0 items-center justify-center pb-4 pt-1">
          <span
            className="flex size-[18px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ backgroundColor: selectedBrand.color }}
            aria-hidden
          >
            {selectedBrand.name.charAt(0)}
          </span>
        </div>
      ) : (
        <div className="shrink-0 px-[18px] pb-5">
          <BusinessSearch selected={selectedBrand} onSelect={setSelectedBrand} />
        </div>
      )}

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto">
        {NAV_MAIN.map(renderItem)}

        {/* Divider */}
        <div className={collapsed ? "px-3 py-3" : "px-5 py-3"}>
          <div className="h-px w-full bg-[#e3e3e3]" role="separator" aria-hidden />
        </div>

        {NAV_BELOW.map(renderItem)}
      </nav>
    </aside>
  );
}
