"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { Icon } from "@yahoo/uds";
import { Cross, LogOut, MagnifyingGlass, Preferences, ThreeLinesSpread } from "@yahoo/uds-icons";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "@/lib/useOnClickOutside";
import { useGlobalSearch } from "@/lib/useGlobalSearch";
import { useDelayedReveal } from "@/lib/useDelayedReveal";
import { GlobalSearchDropdown } from "@/components/GlobalSearchDropdown";
import { ContentDetailsModal } from "@/components/ContentDetailsModal";
import type { ContentModalItem, SearchableContentItem } from "@/lib/mockData";

/** Search field expand/collapse duration — the dropdown waits for this to finish before it reveals. */
const FIELD_TRANSITION_MS = 260;

interface GlobalHeaderProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export function GlobalHeader({ onToggleSidebar, sidebarCollapsed }: GlobalHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ContentModalItem | null>(null);
  const { phase, items } = useGlobalSearch(searchOpen ? query : "");

  // Staggered reveal: overlay fades in almost immediately, the field's inner
  // content (input/count/close) fades in just after the box starts expanding,
  // and the results panel only appears once the field is fully expanded.
  const [overlayRendered, overlayShown] = useDelayedReveal(searchOpen, 10, 180);
  const [fieldContentRendered, fieldContentShown] = useDelayedReveal(searchOpen, 90, 120);
  const [dropdownRendered, dropdownShown] = useDelayedReveal(searchOpen, FIELD_TRANSITION_MS, 160);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function handleSelectItem(item: SearchableContentItem) {
    setSelectedItem({
      id: item.id,
      title: item.title,
      description: item.description,
      snippet: item.description,
      contentType: item.contentType,
      thumbnailSeed: item.thumbnailSeed,
      publishedAt: item.publishedAt,
      status: item.status,
    });
    closeSearch();
  }

  useOnClickOutside(
    profileRef,
    () => {
      setProfileOpen(false);
    },
    profileOpen
  );

  useOnClickOutside(
    searchRef,
    () => {
      closeSearch();
    },
    searchOpen
  );

  useEffect(() => {
    if (!profileOpen && !searchOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProfileOpen(false);
        closeSearch();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [profileOpen, searchOpen]);

  return (
    <header
      className="flex h-16 w-full items-center gap-4 border-b border-[#f0f3f5] bg-white py-1 pl-3 pr-8"
      role="banner"
    >
      {/* Left lockup: menu button + logo wordmark */}
      <div className="flex shrink-0 items-center gap-4 pr-12">
        <button
          type="button"
          className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-[#f0f3f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d2eff] focus-visible:ring-offset-2"
          aria-label={sidebarCollapsed ? "Expand menu" : "Collapse menu"}
          onClick={onToggleSidebar}
        >
          <Icon name={ThreeLinesSpread} size="sm" variant="outline" className="text-[#464e56]" />
        </button>

        <Link
          href="/"
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d2eff] focus-visible:ring-offset-2"
          aria-label="Partner Portal home"
        >
          <span className="whitespace-nowrap font-yahoo-product-sans text-[21px] font-bold leading-5 tracking-[-0.04em] text-[#6155F5]">
            partner portal
          </span>
        </Link>
      </div>

      {/* Right utilities: search + profile */}
      <div className="flex flex-1 items-center justify-end gap-4">
        {/* Search — the pill itself animates its width; contents + results panel are staggered */}
        <div ref={searchRef} className={`relative flex items-center ${searchOpen ? "flex-1" : ""}`}>
          <div
            className={`flex items-center overflow-hidden rounded-full border transition-all duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              searchOpen
                ? "w-full gap-3 border-transparent bg-[#f0f3f5] px-6 py-[10px]"
                : "size-9 justify-center border-[#e0e4e9] bg-white hover:bg-[#f0f3f5]"
            }`}
          >
            {searchOpen ? (
              fieldContentRendered && (
                <div
                  className={`flex w-full items-center gap-3 transition-opacity duration-150 ${
                    fieldContentShown ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Icon name={MagnifyingGlass} size="sm" variant="outline" className="shrink-0 text-[#6e7780]" />
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by article title, UUID or content type"
                    className="h-5 min-w-0 flex-1 bg-transparent font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#232a31] placeholder:text-[#6e7780] outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") closeSearch();
                    }}
                  />
                  <span
                    className={`shrink-0 whitespace-nowrap font-yahoo-product-sans text-[12px] leading-4 text-[#6e7780] transition-opacity ${
                      phase === "searching" ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {items.length} results
                  </span>
                  <button
                    type="button"
                    className="flex size-7 shrink-0 items-center justify-center rounded-full hover:bg-[#e0e4e9] focus-visible:outline-none"
                    aria-label="Close search"
                    onClick={closeSearch}
                  >
                    <Icon name={Cross} size="sm" variant="outline" className="text-[#464e56]" />
                  </button>
                </div>
              )
            ) : (
              <button
                type="button"
                className="flex size-9 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d2eff] focus-visible:ring-offset-2"
                aria-label="Open search"
                onClick={() => setSearchOpen(true)}
              >
                <Icon name={MagnifyingGlass} size="sm" variant="outline" className="text-[#232a31]" />
              </button>
            )}
          </div>

          {dropdownRendered && (
            <GlobalSearchDropdown
              phase={phase}
              items={items}
              onSelectItem={handleSelectItem}
              shown={dropdownShown}
            />
          )}
        </div>

        {/* Background overlay — dims the page below the header while search is open */}
        {overlayRendered &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
                overlayShown ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeSearch}
              aria-hidden="true"
            />,
            document.body,
          )}

        {/* Profile avatar */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full bg-[#f0f3f5] font-yahoo-product-sans text-[13px] font-medium leading-4 text-[#232a31] hover:bg-[#e9eef2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7d2eff] focus-visible:ring-offset-2"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((v) => !v)}
          >
            JF
          </button>

          {profileOpen ? (
            <div
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 top-full z-50 mt-2 w-[311px] overflow-hidden rounded-[8px] border border-[#f5f5f5] bg-white shadow-[0px_0px_1px_0px_rgba(0,0,0,0.10),0px_4px_8px_0px_rgba(0,0,0,0.10)]"
            >
              {/* Profile header */}
              <div className="px-4 pb-0 pt-2">
                <div className="flex items-center gap-4 pb-4 pt-5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f0f3f5]">
                    <span className="font-yahoo-product-sans text-[13px] font-medium leading-4 text-[#232a31]">
                      JF
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-yahoo-product-sans text-[18px] font-bold leading-6 text-[#232a31] whitespace-nowrap">
                      Jaden Fernandez
                    </p>
                    <p className="font-yahoo-product-sans text-[12px] font-normal leading-4 text-[#464e56] whitespace-nowrap">
                      jaden.fernandez@yahooinc.com
                    </p>
                  </div>
                </div>
                {/* Divider */}
                <div className="py-2">
                  <div className="h-px w-full bg-[#f0f3f5]" />
                </div>
              </div>

              {/* Menu items */}
              <div className="flex flex-col gap-1 pb-3 pt-1">
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-4 px-5 py-[10px] text-left hover:bg-[#f5f8fa]"
                  onClick={() => setProfileOpen(false)}
                >
                  <Icon name={Preferences} size="sm" variant="outline" className="shrink-0 text-[#232a31]" />
                  <span className="font-yahoo-product-sans text-[13px] font-medium leading-4 text-[#232a31]">
                    Settings
                  </span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-4 px-5 py-[10px] text-left hover:bg-[#f5f8fa]"
                  onClick={() => setProfileOpen(false)}
                >
                  <Icon name={LogOut} size="sm" variant="outline" className="shrink-0 text-[#232a31]" />
                  <span className="font-yahoo-product-sans text-[13px] font-medium leading-4 text-[#232a31]">
                    Sign out
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ContentDetailsModal
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </header>
  );
}
