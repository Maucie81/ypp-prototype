"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Icon } from "@yahoo/uds";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Cog,
  Cross,
} from "@yahoo/uds-icons";
import { useOnClickOutside } from "@/lib/useOnClickOutside";
import { useRef } from "react";
import { getMockUserById } from "@/lib/mockData";

const FREQUENCY_OPTIONS = ["Immediate", "Daily Summary", "Weekly Summary", "Monthly Summary"];
const CONTENT_TYPES_OPTIONS = ["Articles", "Slideshows"];

const NOTIFICATION_SECTIONS = [
  {
    id: "feed-infrastructure",
    title: "Feed infrastructure issues",
    description: "Select one or more alert types.",
    checkboxes: [
      { id: "critical", label: "Critical", subtext: "Publishing failures, rejections" },
      { id: "warnings", label: "Warnings", subtext: "Format issues, guidelines" },
    ],
    hasFrequency: true,
    badges: ["Critical", "Warnings"],
  },
  {
    id: "content-quality",
    title: "Content quality issues",
    description: "Select one or more alert types.",
    checkboxes: [
      { id: "failures", label: "Failures", subtext: "Content failures" },
      { id: "warnings", label: "Warnings", subtext: "Content warnings" },
    ],
    hasFrequency: true,
    badges: ["Failures", "Warnings"],
  },
  {
    id: "content-performance",
    title: "Content performance alerts",
    description: "Select one or more alert types.",
    checkboxes: [
      { id: "trending", label: "Trending content", subtext: "Articles performing above 3 standard deviations from median" },
      { id: "significant", label: "Significant performance changes", subtext: "50%+ increase/decrease in views" },
      { id: "weekly", label: "Weekly performance summary", subtext: "Top 5 articles + overall metrics" },
      { id: "monthly", label: "Monthly performance digest", subtext: "Complete performance report" },
    ],
    hasContentTypes: true,
    badges: ["Trending content", "Performance changes"],
  },
  {
    id: "account-partnership",
    title: "Account & partnership updates",
    description: "Select one or more alert types.",
    checkboxes: [
      { id: "critical", label: "Critical account changes", subtext: "Suspensions, billing issues" },
      { id: "features", label: "New feature announcements", subtext: "Portal updates, new tools" },
      { id: "policy", label: "Policy updates", subtext: "Editorial guidelines, terms changes" },
      { id: "maintenance", label: "System maintenance", subtext: "Scheduled downtime, maintenance windows" },
    ],
    badges: ["Critical account changes", "Policy updates"],
  },
];

const BRANDS = [
  { id: "1", name: "2 Dads 2 Twins", uuid: "e3760844-0426-3ea5-9808-a6ec9035d382" },
  { id: "2", name: "20 Minutes France", uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
  { id: "3", name: "Brand C", uuid: "b2c3d4e5-f6a7-8901-bcde-f12345678901" },
  { id: "4", name: "Brand D", uuid: "c3d4e5f6-a7b8-9012-cdef-123456789012" },
];

const ROLES = [
  { id: "admin", label: "Admin", description: "Role description" },
  { id: "viewer", label: "Viewer", description: "Role description" },
];

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function UserDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const user = useMemo(() => getMockUserById(id), [id]);
  const [activeTab, setActiveTab] = useState<"profile" | "notifications">("profile");
  const [expandedSection, setExpandedSection] = useState<string>("feed-infrastructure");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(["1", "2"]);
  const [selectedRole, setSelectedRole] = useState<string>("viewer");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [frequencyOpenSection, setFrequencyOpenSection] = useState<string | null>(null);
  const [frequencyValues, setFrequencyValues] = useState<string[]>(["Daily Summary", "Weekly Summary"]);
  const [contentQualityFrequencyValues, setContentQualityFrequencyValues] = useState<string[]>(["Daily Summary", "Weekly Summary"]);
  const [contentTypesValues, setContentTypesValues] = useState<string[]>(["Articles", "Slideshows"]);
  const [contentTypesOpen, setContentTypesOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [notificationsDirty, setNotificationsDirty] = useState(false);
  const [sectionCheckboxes, setSectionCheckboxes] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    NOTIFICATION_SECTIONS.forEach((sec) => {
      if (sec.checkboxes) {
        init[sec.id] = {};
        sec.checkboxes.forEach((cb) => {
          init[sec.id][cb.id] = true;
        });
      }
    });
    return init;
  });
  const [internalNotes, setInternalNotes] = useState<Record<string, string>>({});
  const frequencyRef = useRef<HTMLDivElement>(null);
  const contentQualityFreqRef = useRef<HTMLDivElement>(null);
  const contentTypesRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(frequencyRef, () => setFrequencyOpenSection((s) => (s === "feed-infrastructure" ? null : s)), frequencyOpenSection === "feed-infrastructure");
  useOnClickOutside(contentQualityFreqRef, () => setFrequencyOpenSection((s) => (s === "content-quality" ? null : s)), frequencyOpenSection === "content-quality");
  useOnClickOutside(contentTypesRef, () => setContentTypesOpen(false), contentTypesOpen);
  useOnClickOutside(brandRef, () => setBrandDropdownOpen(false), brandDropdownOpen);
  useOnClickOutside(roleRef, () => setRoleDropdownOpen(false), roleDropdownOpen);

  const toggleSection = (sectionId: string) => {
    setExpandedSection((prev) => (prev === sectionId ? "" : sectionId));
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((b) => b !== brandId) : [...prev, brandId]
    );
  };

  const toggleFrequency = (value: string, sectionId: string) => {
    if (sectionId === "feed-infrastructure") {
      setFrequencyValues((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else {
      setContentQualityFrequencyValues((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
    setNotificationsDirty(true);
  };

  const toggleContentType = (value: string) => {
    setContentTypesValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setNotificationsDirty(true);
  };

  const setSectionCheckbox = (sectionId: string, checkboxId: string, checked: boolean) => {
    setSectionCheckboxes((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [checkboxId]: checked },
    }));
    setNotificationsDirty(true);
  };

  const handleInternalNoteChange = (sectionId: string, value: string) => {
    setInternalNotes((prev) => ({ ...prev, [sectionId]: value }));
    setNotificationsDirty(true);
  };

  if (!user) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/settings/user-management" className="font-yahoo-product-sans text-[14px] font-medium text-[#464e56] hover:underline">
          ← Back to Users
        </Link>
        <p className="font-yahoo-product-sans text-[14px] text-[#6e7780]">User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <nav
        aria-label="Breadcrumb"
        className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]"
      >
        <Link href="/settings/user-management" className="hover:underline">
          Users
        </Link>
        <span className="px-2.5 font-normal">&gt;</span>
        <span className="font-normal text-[#6e7780]">Level 2</span>
        <span className="px-2.5 font-normal">&gt;</span>
        <span>User details</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E2E6FF] font-yahoo-product-sans text-[20px] font-semibold text-[#232a31]">
              {getInitials(user.firstName, user.lastName)}
            </span>
            <button
              type="button"
              className="absolute -bottom-0.5 -right-0.5 flex size-7 items-center justify-center rounded-full bg-[#7d2eff] text-white hover:bg-[#6b26e6]"
              aria-label="Profile settings"
            >
              <Icon name={Cog} size="sm" variant="outline" className="size-4 text-white" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#232a31]">
                {user.fullName}
              </h1>
              {user.deactivated && (
                <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 font-yahoo-product-sans text-[12px] font-medium text-[#6e7780]">
                  Deactivated account
                </span>
              )}
            </div>
            <p className="mt-0.5 font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#464e56]">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-[#e0e4e9]">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`py-3 font-yahoo-product-sans text-[14px] font-medium leading-5 border-b-4 transition-colors ${
              activeTab === "profile"
                ? "border-[#7d2eff] text-[#232a31]"
                : "border-transparent text-[#6e7780] hover:text-[#232a31]"
            }`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`py-3 font-yahoo-product-sans text-[14px] font-medium leading-5 border-b-4 transition-colors ${
              activeTab === "notifications"
                ? "border-[#7d2eff] text-[#232a31]"
                : "border-transparent text-[#6e7780] hover:text-[#232a31]"
            }`}
          >
            Notifications
          </button>
        </div>
      </div>

      {activeTab === "profile" && (
        <div className="flex max-w-[640px] flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div>
              <label className="mb-1.5 block font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#464e56]">
                Email (required)
              </label>
              <input
                type="email"
                defaultValue={user.email}
                className="h-9 w-full rounded-[4px] border border-[#e0e4e9] bg-white px-3 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] focus:border-[#7d2eff] focus:outline-none focus:ring-1 focus:ring-[#7d2eff]"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-1.5 block font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#464e56]">
                  First name (required)
                </label>
                <input
                  type="text"
                  defaultValue={user.firstName}
                  className="h-9 w-full rounded-[4px] border border-[#e0e4e9] bg-white px-3 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] focus:border-[#7d2eff] focus:outline-none focus:ring-1 focus:ring-[#7d2eff]"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#464e56]">
                  Last name (required)
                </label>
                <input
                  type="text"
                  defaultValue={user.lastName}
                  className="h-9 w-full rounded-[4px] border border-[#e0e4e9] bg-white px-3 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] focus:border-[#7d2eff] focus:outline-none focus:ring-1 focus:ring-[#7d2eff]"
                />
              </div>
            </div>

            <div>
              <h3 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
                Operational access
              </h3>
              <p className="mt-1 font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#6e7780]">
                Assign access across YPP. Use sparingly.
              </p>
              <div ref={roleRef} className="relative mt-2">
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex h-9 w-full max-w-[608px] items-center justify-between rounded-[4px] border border-[#e0e4e9] bg-white px-3 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] hover:border-[#828a93]"
                >
                  <span>{ROLES.find((r) => r.id === selectedRole)?.label ?? "Viewer"}</span>
                  <Icon name={ChevronDown} size="sm" variant="outline" className="size-4 text-[#6e7780]" />
                </button>
                {roleDropdownOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-full max-w-[608px] rounded-[4px] border border-[#e0e4e9] bg-white py-2 shadow-[0px_8px_24px_rgba(16,24,40,0.12)]">
                    {ROLES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(r.id);
                          setRoleDropdownOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[#f5f8fa]"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
                            {r.label}
                          </span>
                          <span className="font-yahoo-product-sans text-[12px] font-normal leading-4 text-[#6e7780]">
                            {r.description}
                          </span>
                        </div>
                        {selectedRole === r.id && (
                          <Icon name={Check} size="sm" variant="outline" className="shrink-0 text-[#7d2eff]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
                Brand access (optional)
              </h3>
              <p className="mt-1 font-yahoo-product-sans text-[14px] font-normal leading-5 text-[#6e7780]">
                Assign brand that the role extends to.{" "}
                <button type="button" className="underline hover:no-underline">
                  See role details
                </button>
              </p>
              <div ref={brandRef} className="relative mt-2">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setBrandDropdownOpen((v) => !v);
                    }
                  }}
                  className="flex min-h-9 w-full max-w-[608px] cursor-pointer flex-wrap items-center gap-2 rounded-[4px] border border-[#e0e4e9] bg-white px-3 py-2 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] hover:border-[#828a93]"
                >
                  {selectedBrands.map((bid) => {
                    const b = BRANDS.find((x) => x.id === bid);
                    return b ? (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 rounded-full bg-[#f0f3f5] pl-2 pr-1 py-0.5"
                      >
                        {b.name}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBrand(b.id);
                          }}
                          className="rounded-full p-0.5 hover:bg-[#e0e4e9]"
                          aria-label={`Remove ${b.name}`}
                        >
                          <Icon name={Cross} size="sm" variant="outline" className="size-3.5" />
                        </button>
                      </span>
                    ) : null;
                  })}
                  <Icon name={ChevronDown} size="sm" variant="outline" className="ml-auto size-4 text-[#6e7780]" />
                </div>
                {brandDropdownOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full max-w-[608px] overflow-y-auto rounded-[4px] border border-[#e0e4e9] bg-white py-2 shadow-[0px_8px_24px_rgba(16,24,40,0.12)]">
                    <label className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-[#f5f8fa]">
                      <input
                        type="checkbox"
                        checked={selectedBrands.length === BRANDS.length}
                        onChange={() => {
                          setSelectedBrands(
                            selectedBrands.length === BRANDS.length ? [] : BRANDS.map((b) => b.id)
                          );
                        }}
                        className="rounded border-[#e0e4e9] accent-[#232a31]"
                      />
                      <span className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
                        Select all
                      </span>
                    </label>
                    {BRANDS.map((b) => {
                      const isSelected = selectedBrands.includes(b.id);
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => toggleBrand(b.id)}
                          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-[#f5f8fa]"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
                              {b.name}
                            </span>
                            {b.uuid && (
                              <span className="font-yahoo-product-sans text-[12px] font-normal leading-4 text-[#6e7780]">
                                {b.uuid}
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <Icon name={Check} size="sm" variant="outline" className="shrink-0 text-[#7d2eff]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#f0f3f5] pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-9 rounded-full border border-[#e0e4e9] bg-white px-4 py-2 font-yahoo-product-sans text-[14px] font-medium text-[#232a31] hover:bg-[#f5f8fa]"
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 rounded-full border border-[#e0e4e9] bg-white px-4 py-2 font-yahoo-product-sans text-[14px] font-medium text-[#232a31] hover:bg-[#f5f8fa]"
            >
              Resend invite
            </button>
            <button
              type="button"
              className="h-9 rounded-full bg-[#7d2eff] px-4 py-2 font-yahoo-product-sans text-[14px] font-medium text-white hover:bg-[#6b26e6]"
            >
              Save changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="flex max-w-[640px] flex-col gap-4">
          {NOTIFICATION_SECTIONS.map((section) => {
            const isExpanded = expandedSection === section.id;
            const ChevronIcon = isExpanded ? ChevronUp : ChevronDown;
            const headerRow = (
              <div
                className="flex w-full items-center gap-3 py-4 text-left"
                onClick={() => toggleSection(section.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleSection(section.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Icon name={ChevronIcon} size="sm" variant="outline" className="shrink-0 text-[#6e7780]" />
                <span className="min-w-0 flex-1 font-yahoo-product-sans text-[16px] font-semibold leading-5 text-[#232a31]">
                  {section.title}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  {section.badges?.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-[#e0e4e9] bg-white px-2 py-0.5 font-yahoo-product-sans text-[12px] font-medium text-[#6e7780]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            );

            const freqValues = section.id === "feed-infrastructure" ? frequencyValues : contentQualityFrequencyValues;
            return (
              <div key={section.id} className="rounded-[8px] border border-[#f0f3f5] bg-white shadow-[0px_1px_2px_rgba(31,31,31,0.05)]">
                <div className="cursor-pointer px-6 hover:bg-[#f5f8fa]">{headerRow}</div>
                {isExpanded && (
                  <div className="border-t border-[#f0f3f5] pl-[56px] pr-6 pb-6 pt-2">
                    {section.description && (
                      <p className="mb-4 font-yahoo-product-sans text-[14px] leading-5 text-[#464e56]">
                        {section.description}
                      </p>
                    )}
                    {section.checkboxes && section.checkboxes.length > 0 && (
                      <div className="flex flex-col gap-3">
                        {section.checkboxes.map((cb) => (
                          <label key={cb.id} className="flex cursor-pointer flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={sectionCheckboxes[section.id]?.[cb.id] ?? true}
                                onChange={() => setSectionCheckbox(section.id, cb.id, !(sectionCheckboxes[section.id]?.[cb.id] ?? true))}
                                className="h-4 w-4 rounded border-[#e0e4e9] accent-[#232a31]"
                              />
                              <span className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
                                {cb.label}
                              </span>
                            </div>
                            <span className="pl-6 font-yahoo-product-sans text-[13px] leading-4 text-[#6e7780]">
                              {cb.subtext}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                    {section.hasFrequency && (
                      <div
                        ref={section.id === "feed-infrastructure" ? frequencyRef : contentQualityFreqRef}
                        className="relative mt-4"
                      >
                        <label className="mb-1.5 block font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
                          Frequency (required)
                        </label>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setFrequencyOpenSection((v) => (v === section.id ? null : section.id))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setFrequencyOpenSection((v) => (v === section.id ? null : section.id));
                            }
                          }}
                          className="flex min-h-9 w-full cursor-pointer flex-wrap items-center gap-2 rounded-[4px] border border-[#e0e4e9] bg-white px-3 py-2 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] hover:border-[#828a93]"
                          style={{ maxWidth: 608 }}
                        >
                          {freqValues.map((v) => (
                            <span
                              key={v}
                              className="inline-flex items-center gap-1 rounded-full bg-[#f0f3f5] pl-2 pr-1 py-0.5"
                            >
                              {v}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFrequency(v, section.id);
                                }}
                                className="rounded-full p-0.5 hover:bg-[#e0e4e9]"
                                aria-label={`Remove ${v}`}
                              >
                                <Icon name={Cross} size="sm" variant="outline" className="size-3.5" />
                              </button>
                            </span>
                          ))}
                          <Icon name={ChevronDown} size="sm" variant="outline" className="ml-auto size-4 text-[#6e7780]" />
                        </div>
                        {frequencyOpenSection === section.id && (
                          <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-[4px] border border-[#e0e4e9] bg-white py-2 shadow-[0px_8px_24px_rgba(16,24,40,0.12)]" style={{ maxWidth: 608 }}>
                            <div className="px-3 py-1.5 font-yahoo-product-sans text-[12px] font-semibold uppercase tracking-wider text-[#6e7780]">
                              Immediate
                            </div>
                            {FREQUENCY_OPTIONS.map((opt) => (
                              <label
                                key={opt}
                                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-[#f5f8fa]"
                              >
                                <input
                                  type="checkbox"
                                  checked={freqValues.includes(opt)}
                                  onChange={() => toggleFrequency(opt, section.id)}
                                  className="rounded border-[#e0e4e9] accent-[#232a31]"
                                />
                                <span className="font-yahoo-product-sans text-[14px] leading-5 text-[#232a31]">
                                  {opt}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {section.hasContentTypes && (
                      <div ref={contentTypesRef} className="relative mt-4">
                        <label className="mb-1.5 block font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
                          Content Types (required)
                        </label>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setContentTypesOpen((v) => !v)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setContentTypesOpen((v) => !v);
                            }
                          }}
                          className="flex min-h-9 w-full cursor-pointer flex-wrap items-center gap-2 rounded-[4px] border border-[#e0e4e9] bg-white px-3 py-2 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] hover:border-[#828a93]"
                          style={{ maxWidth: 608 }}
                        >
                          {contentTypesValues.map((v) => (
                            <span
                              key={v}
                              className="inline-flex items-center gap-1 rounded-full bg-[#f0f3f5] pl-2 pr-1 py-0.5"
                            >
                              {v}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleContentType(v);
                                }}
                                className="rounded-full p-0.5 hover:bg-[#e0e4e9]"
                                aria-label={`Remove ${v}`}
                              >
                                <Icon name={Cross} size="sm" variant="outline" className="size-3.5" />
                              </button>
                            </span>
                          ))}
                          <Icon name={ChevronDown} size="sm" variant="outline" className="ml-auto size-4 text-[#6e7780]" />
                        </div>
                        {contentTypesOpen && (
                          <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-[4px] border border-[#e0e4e9] bg-white py-2 shadow-[0px_8px_24px_rgba(16,24,40,0.12)]" style={{ maxWidth: 608 }}>
                            {CONTENT_TYPES_OPTIONS.map((opt) => (
                              <label
                                key={opt}
                                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-[#f5f8fa]"
                              >
                                <input
                                  type="checkbox"
                                  checked={contentTypesValues.includes(opt)}
                                  onChange={() => toggleContentType(opt)}
                                  className="rounded border-[#e0e4e9] accent-[#232a31]"
                                />
                                <span className="font-yahoo-product-sans text-[14px] leading-5 text-[#232a31]">
                                  {opt}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="mt-4">
                      <label className="mb-1.5 block font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#464e56]">
                        Internal notes
                      </label>
                      <textarea
                        placeholder="Internal notes"
                        rows={3}
                        value={internalNotes[section.id] ?? ""}
                        onChange={(e) => handleInternalNoteChange(section.id, e.target.value)}
                        className="w-full rounded-[4px] border border-[#e0e4e9] bg-white px-3 py-2 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] placeholder:text-[#828a93] focus:border-[#7d2eff] focus:outline-none focus:ring-1 focus:ring-[#7d2eff]"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-3 border-t border-[#f0f3f5] pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-9 rounded-full border border-[#e0e4e9] bg-white px-4 py-2 font-yahoo-product-sans text-[14px] font-medium text-[#232a31] hover:bg-[#f5f8fa]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!notificationsDirty}
              className={`h-9 rounded-full px-4 py-2 font-yahoo-product-sans text-[14px] font-medium ${
                notificationsDirty
                  ? "bg-[#7d2eff] text-white hover:bg-[#6b26e6]"
                  : "cursor-not-allowed bg-[#e0e4e9] text-[#828a93]"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
