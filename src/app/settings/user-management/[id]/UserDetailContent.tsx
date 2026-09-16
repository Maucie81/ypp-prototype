"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@yahoo/uds";
import {
  ChevronDown,
  ChevronUp,
  Cog,
  Cross,
} from "@yahoo/uds-icons";
import { useOnClickOutside } from "@/lib/useOnClickOutside";
import { useRef } from "react";
import { Toast } from "@/components/ui/Toast";
import { FormErrorBanner, RadioGroup, TextField } from "@/components/user-management/FormFields";
import { ToolAccessCard, toolAccessFieldId } from "@/components/user-management/ToolAccessCard";
import { useUsers } from "@/contexts/UsersContext";
import {
  EMPTY_TOOL_ACCESS,
  getToolAccessErrors,
  type EmployeeStatus,
  type ToolAccessState,
} from "@/lib/toolAccess";

const YPP_TOOL_ID = "ypp";

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

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function UserDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const { getUserById, updateUser, pendingToast, clearPendingToast, showToast } = useUsers();
  const user = getUserById(id);
  const [activeTab, setActiveTab] = useState<"profile" | "notifications">("profile");
  const [expandedSection, setExpandedSection] = useState<string>("feed-infrastructure");

  const [email, setEmail] = useState(user?.email ?? "");
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [employeeStatus, setEmployeeStatus] = useState<EmployeeStatus | null>(user?.employeeStatus ?? null);
  const [access, setAccess] = useState<ToolAccessState>(user?.access ?? EMPTY_TOOL_ACCESS);
  const [profileDirty, setProfileDirty] = useState(false);
  const [showAccessErrors, setShowAccessErrors] = useState(false);

  const accessErrors = getToolAccessErrors(access);
  const profileValid =
    email.trim().includes("@") &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    employeeStatus !== null &&
    accessErrors.length === 0;
  const canSave = profileDirty && profileValid;

  function markDirty<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setProfileDirty(true);
    };
  }

  function handleSaveChanges() {
    if (!user || !canSave || !employeeStatus) return;
    const fn = firstName.trim();
    const ln = lastName.trim();
    updateUser(user.id, {
      email: email.trim(),
      firstName: fn,
      lastName: ln,
      fullName: `${fn} ${ln}`,
      employeeStatus,
      access,
      role: access.operational.roleId === "admin" ? "Admin" : "Viewer",
    });
    setProfileDirty(false);
    showToast("Changes saved");
  }

  const [frequencyOpenSection, setFrequencyOpenSection] = useState<string | null>(null);
  const [frequencyValues, setFrequencyValues] = useState<string[]>(["Daily Summary", "Weekly Summary"]);
  const [contentQualityFrequencyValues, setContentQualityFrequencyValues] = useState<string[]>(["Daily Summary", "Weekly Summary"]);
  const [contentTypesValues, setContentTypesValues] = useState<string[]>(["Articles", "Slideshows"]);
  const [contentTypesOpen, setContentTypesOpen] = useState(false);
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
  useOnClickOutside(frequencyRef, () => setFrequencyOpenSection((s) => (s === "feed-infrastructure" ? null : s)), frequencyOpenSection === "feed-infrastructure");
  useOnClickOutside(contentQualityFreqRef, () => setFrequencyOpenSection((s) => (s === "content-quality" ? null : s)), frequencyOpenSection === "content-quality");
  useOnClickOutside(contentTypesRef, () => setContentTypesOpen(false), contentTypesOpen);

  const toggleSection = (sectionId: string) => {
    setExpandedSection((prev) => (prev === sectionId ? "" : sectionId));
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
              className="absolute -bottom-0.5 -right-0.5 flex size-7 items-center justify-center rounded-full bg-[#5D5EFF] text-white hover:bg-[#4A4BE8]"
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
              {user.inviteSent && (
                <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 font-yahoo-product-sans text-[12px] font-medium text-[#6e7780]">
                  Invite sent
                </span>
              )}
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
            className={`group relative py-3 font-yahoo-product-sans text-[14px] leading-5 transition-all ${
              activeTab === "profile"
                ? "font-medium text-[#232a31]"
                : "font-medium text-[#6e7780] hover:font-semibold hover:text-[#232a31]"
            }`}
          >
            Profile
            <span
              className={`absolute bottom-0 left-0 h-1 w-full rounded-full ${
                activeTab === "profile" ? "bg-[#5D5EFF]" : "bg-transparent"
              }`}
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`group relative py-3 font-yahoo-product-sans text-[14px] leading-5 transition-all ${
              activeTab === "notifications"
                ? "font-medium text-[#232a31]"
                : "font-medium text-[#6e7780] hover:font-semibold hover:text-[#232a31]"
            }`}
          >
            Notifications
            <span
              className={`absolute bottom-0 left-0 h-1 w-full rounded-full ${
                activeTab === "notifications" ? "bg-[#5D5EFF]" : "bg-transparent"
              }`}
              aria-hidden
            />
          </button>
        </div>
      </div>

      {activeTab === "profile" && (
        <div className="flex max-w-[640px] flex-col gap-8">
          {showAccessErrors && (
            <FormErrorBanner
              items={accessErrors.map((e) => ({
                id: e.field,
                label: e.message,
                targetId: toolAccessFieldId(YPP_TOOL_ID, e.field),
              }))}
            />
          )}

          <div className="flex flex-col gap-6">
            <TextField
              id="user-email"
              label="Email"
              type="email"
              required
              value={email}
              onChange={markDirty(setEmail)}
              autoComplete="off"
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <TextField
                id="user-first-name"
                label="First name"
                required
                value={firstName}
                onChange={markDirty(setFirstName)}
                autoComplete="off"
              />
              <TextField
                id="user-last-name"
                label="Last name"
                required
                value={lastName}
                onChange={markDirty(setLastName)}
                autoComplete="off"
              />
            </div>
            <RadioGroup<EmployeeStatus>
              label="Employee status"
              required
              name="user-employee-status"
              value={employeeStatus}
              onChange={markDirty(setEmployeeStatus)}
              options={[
                { value: "employee", label: "Employee (full-time or contract)" },
                { value: "non-employee", label: "Non-employee (external partner or freelancer)" },
              ]}
            />
          </div>

          <section className="flex flex-col gap-2.5">
            <h2 className="py-2 font-yahoo-product-sans text-[18px] font-bold leading-6 text-[#232a31]">
              Tool access
            </h2>
            <ToolAccessCard
              toolId={YPP_TOOL_ID}
              toolName="Yahoo Partner Portal"
              value={access}
              onChange={markDirty(setAccess)}
              disabled={employeeStatus === null}
              showErrors={showAccessErrors}
              onBlockedCollapse={() => setShowAccessErrors(true)}
              onRemove={() => markDirty(setAccess)(EMPTY_TOOL_ACCESS)}
            />
          </section>

          <div className="flex justify-end gap-3 border-t border-[#f0f3f5] pt-6">
            <button
              type="button"
              onClick={() => router.push("/settings/user-management")}
              className="h-9 rounded-full border border-[#e0e4e9] bg-white px-5 font-yahoo-product-sans text-[14px] font-medium text-[#232a31] hover:bg-[#f5f8fa]"
            >
              Cancel
            </button>
            {user.inviteSent && (
              <button
                type="button"
                onClick={() => showToast("Invite resent")}
                className="h-9 rounded-full border border-[#e0e4e9] bg-white px-5 font-yahoo-product-sans text-[14px] font-medium text-[#232a31] hover:bg-[#f5f8fa]"
              >
                Resend invite
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={!canSave}
              className={`h-9 rounded-full px-5 font-yahoo-product-sans text-[14px] font-medium text-white transition-colors ${
                canSave ? "bg-[#5D5EFF] hover:bg-[#4A4BE8]" : "cursor-not-allowed bg-[#e0e4e9]"
              }`}
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
                        className="w-full rounded-[4px] border border-[#e0e4e9] bg-white px-3 py-2 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] placeholder:text-[#828a93] focus:border-[#5D5EFF] focus:outline-none focus:ring-1 focus:ring-[#5D5EFF]"
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
                  ? "bg-[#5D5EFF] text-white hover:bg-[#4A4BE8]"
                  : "cursor-not-allowed bg-[#e0e4e9] text-[#828a93]"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <Toast open={pendingToast !== null} message={pendingToast ?? ""} onClose={clearPendingToast} />
    </div>
  );
}
