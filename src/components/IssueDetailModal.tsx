"use client";

import { useState } from "react";
import { Icon } from "@yahoo/uds";
import {
  Article,
  VideoCamera,
  ImageGallery,
  Cross,
  Warning,
  Lightbulb,
  ChevronDown,
  Image as ImageIcon,
} from "@yahoo/uds-icons";
import { PublishStatusLabel } from "@/components/PublishStatusLabel";
import {
  getContentMetadata,
  type ContentModalItem,
  type IssueModalData,
  type IssueModalItem,
} from "@/lib/mockData";

// ── Color tokens ──────────────────────────────────────────────────────────────

const COLORS = {
  warning: {
    accent: "#e26900",
    bg: "#fff9f2",
  },
  failed: {
    accent: "#d30d2e",
    bg: "#fff0f1",
  },
} as const;

// ── Small shared helpers ──────────────────────────────────────────────────────

function ContentTypeIcon({ type }: { type: string }) {
  const name =
    type === "video" ? VideoCamera : type === "slideshow" ? ImageGallery : Article;
  return (
    <Icon name={name} size="xs" variant="outline" className="size-4 shrink-0 text-[#464e56]" />
  );
}

/** Splits `text` into runs, highlighting any occurrence of a term from `terms`. */
function HighlightedText({
  text,
  terms,
  highlightColor,
  bold = false,
}: {
  text: string;
  terms: string[];
  highlightColor: string;
  bold?: boolean;
}) {
  type Run = { text: string; highlight: boolean };
  const runs: Run[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliestIdx = -1;
    let earliestTerm = "";
    for (const term of terms) {
      const idx = remaining.toLowerCase().indexOf(term.toLowerCase());
      if (idx !== -1 && (earliestIdx === -1 || idx < earliestIdx)) {
        earliestIdx = idx;
        earliestTerm = term;
      }
    }
    if (earliestIdx === -1) {
      runs.push({ text: remaining, highlight: false });
      break;
    }
    if (earliestIdx > 0) {
      runs.push({ text: remaining.slice(0, earliestIdx), highlight: false });
    }
    runs.push({ text: remaining.slice(earliestIdx, earliestIdx + earliestTerm.length), highlight: true });
    remaining = remaining.slice(earliestIdx + earliestTerm.length);
  }

  return (
    <>
      {runs.map((run, i) =>
        run.highlight ? (
          <span
            key={i}
            style={{ color: highlightColor }}
            className={bold ? "font-bold" : "font-medium"}
          >
            {run.text}
          </span>
        ) : (
          <span key={i}>{run.text}</span>
        ),
      )}
    </>
  );
}

/** The lightbulb action pill, with an optional underlined hyperlink within the text. */
function ActionPill({
  actionText,
  actionLinkText,
  accent,
}: {
  actionText: string;
  actionLinkText?: string;
  accent: string;
}) {
  const renderText = () => {
    if (!actionLinkText) {
      return <span>{actionText}</span>;
    }
    const idx = actionText.indexOf(actionLinkText);
    if (idx === -1) return <span>{actionText}</span>;
    return (
      <>
        <span>{actionText.slice(0, idx)}</span>
        <a href="#" className="underline" style={{ color: accent }}>
          {actionLinkText}
        </a>
        <span>{actionText.slice(idx + actionLinkText.length)}</span>
      </>
    );
  };

  return (
    <div
      className="flex items-start gap-1 rounded-[4px] p-2"
      style={{ border: `1px solid ${accent}` }}
    >
      <Icon
        name={Lightbulb}
        size="xs"
        variant="outline"
        className="mt-0.5 size-4 shrink-0"
        style={{ color: accent } as React.CSSProperties}
      />
      <p
        className="font-yahoo-product-sans text-[14px] leading-5"
        style={{ color: accent }}
      >
        {renderText()}
      </p>
    </div>
  );
}

/** Content excerpt rendered according to the excerptType. */
function ExcerptBlock({
  issue,
  accent,
}: {
  issue: IssueModalItem;
  accent: string;
}) {
  if (!issue.excerptContent && issue.excerptType !== "image") return null;

  return (
    <div className="flex flex-col gap-3 pt-4" style={{ borderTop: "none" }}>
      {issue.excerptLabel && (
        <p className="font-yahoo-product-sans text-[16px] font-semibold leading-6 text-[#232a31]">
          {issue.excerptLabel}
        </p>
      )}

      {issue.excerptType === "image" ? (
        <div className="relative flex h-[220px] w-full items-center justify-center rounded-[8px] bg-[#f3f3f3]">
          <Icon
            name={ImageIcon}
            size="lg"
            variant="outline"
            className="size-10 text-[#8a9299]"
          />
        </div>
      ) : (
        <p className="font-yahoo-product-sans text-[14px] leading-6 text-[#464e56]">
          {issue.flaggedTerms && issue.flaggedTerms.length > 0 ? (
            <HighlightedText
              text={issue.excerptContent}
              terms={issue.flaggedTerms}
              highlightColor={accent}
              bold={issue.excerptType === "code"}
            />
          ) : (
            issue.excerptContent
          )}
        </p>
      )}
    </div>
  );
}

/** Footer row — "View documentation" button, text link, or nothing. */
function FooterRow({
  footerType,
  borderTop = true,
}: {
  footerType: "button" | "link" | "none";
  borderTop?: boolean;
}) {
  if (footerType === "none") return null;

  return (
    <div
      className={`flex items-center justify-end pt-6 ${borderTop ? "border-t border-[#f0f3f5]" : ""}`}
    >
      {footerType === "button" ? (
        <button className="rounded-full bg-[#7d2eff] px-5 py-2 font-yahoo-product-sans text-[14px] font-bold leading-5 text-white transition-colors hover:bg-[#6b1fe8]">
          View documentation
        </button>
      ) : (
        <p className="font-yahoo-product-sans text-[14px] text-[#232a31]">
          If you have any questions, please{" "}
          <a
            href="mailto:content.partnership.support@yahooinc.com"
            className="underline"
          >
            contact our support team
          </a>
          .
        </p>
      )}
    </div>
  );
}

// ── Single-issue error section ────────────────────────────────────────────────

function SingleIssueSection({
  issue,
  sectionTitle,
  accent,
  bg,
}: {
  issue: IssueModalItem;
  sectionTitle: string;
  accent: string;
  bg: string;
}) {
  return (
    <div
      className="flex flex-col gap-3 rounded-[8px] p-6"
      style={{ backgroundColor: bg }}
    >
      {/* Section header */}
      <div className="flex items-center gap-1.5">
        <Icon
          name={Warning}
          size="xs"
          variant="outline"
          className="size-4 shrink-0"
          style={{ color: accent } as React.CSSProperties}
        />
        <p className="font-yahoo-product-sans text-[16px] font-semibold leading-5 text-[#232a31]">
          {sectionTitle}
        </p>
      </div>

      {/* Description */}
      <p className="font-yahoo-product-sans text-[14px] leading-6 text-[#232a31]">
        {issue.description}
      </p>

      {/* Action pill */}
      <ActionPill
        actionText={issue.actionText}
        actionLinkText={issue.actionLinkText}
        accent={accent}
      />

      {/* Content excerpt (inside the container) */}
      <ExcerptBlock issue={issue} accent={accent} />
    </div>
  );
}

// ── Multi-issue accordion ─────────────────────────────────────────────────────

function AccordionItem({
  issue,
  isExpanded,
  onToggle,
  accent,
  bg,
  footerType,
}: {
  issue: IssueModalItem;
  isExpanded: boolean;
  onToggle: () => void;
  accent: string;
  bg: string;
  footerType: "button" | "link" | "none";
}) {
  return (
    <div>
      {/* Accordion card */}
      <div
        className="overflow-hidden rounded-[8px]"
        style={{ backgroundColor: bg }}
      >
        {/* Header — always clickable */}
        <button
          className="flex w-full items-center gap-3 px-6 py-6 text-left"
          onClick={onToggle}
          aria-expanded={isExpanded}
        >
          <Icon
            name={Warning}
            size="xs"
            variant="outline"
            className="size-4 shrink-0"
            style={{ color: accent } as React.CSSProperties}
          />
          <span className="flex-1 font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
            {issue.title}
          </span>
          <Icon
            name={ChevronDown}
            size="xs"
            variant="outline"
            className="size-4 shrink-0 text-[#6e7780] transition-transform duration-200"
            style={isExpanded ? { transform: "rotate(180deg)" } : undefined}
          />
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="flex flex-col gap-3 border-t border-[#f0f3f5]/40 px-6 pb-6 pt-4">
            <p className="font-yahoo-product-sans text-[14px] leading-6 text-[#232a31]">
              {issue.description}
            </p>
            <ActionPill
              actionText={issue.actionText}
              actionLinkText={issue.actionLinkText}
              accent={accent}
            />
            <ExcerptBlock issue={issue} accent={accent} />
          </div>
        )}
      </div>

      {/* Per-item footer shown below expanded card, above next collapsed card */}
      {isExpanded && footerType !== "none" && (
        <div className="flex items-center justify-end border-b border-[#f0f3f5] pb-6 pt-4">
          {footerType === "button" ? (
            <button className="rounded-full bg-[#7d2eff] px-5 py-2 font-yahoo-product-sans text-[14px] font-bold leading-5 text-white transition-colors hover:bg-[#6b1fe8]">
              View documentation
            </button>
          ) : (
            <p className="font-yahoo-product-sans text-[14px] text-[#232a31]">
              If you have any questions, please{" "}
              <a
                href="mailto:content.partnership.support@yahooinc.com"
                className="underline"
              >
                contact our support team
              </a>
              .
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Metadata row ────────────────────────────────────────────────────────────────

function MetadataRow({ item }: { item: ContentModalItem }) {
  const meta = getContentMetadata(item.id);

  const metaFields = [
    { label: "Partner URL", href: meta.partnerUrl },
    { label: "Yahoo URL", href: meta.yahooUrl },
    { label: "Source feed", value: meta.sourceFeed },
    { label: "GUID", value: meta.guid },
    { label: "Document ID", value: meta.documentId },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {metaFields.map((field, i) => (
        <span key={field.label} className="flex items-center gap-4">
          <span className="font-yahoo-product-sans text-[14px] text-[#464e56]">
            {"href" in field ? (
              <a
                href={field.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7d2eff] underline"
              >
                {field.label}
              </a>
            ) : (
              <span className="group relative cursor-default">
                <span className="border-b border-dashed border-[#6e7780]">
                  {field.label}
                </span>
                {/* Tooltip */}
                <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#232a31] px-2.5 py-1.5 font-yahoo-product-sans text-[12px] leading-4 text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                  {field.value}
                  {/* Arrow */}
                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#232a31]" />
                </span>
              </span>
            )}
          </span>
          {i < metaFields.length - 1 && (
            <span className="text-[#c8cdd2]" aria-hidden>
              |
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

// ── Content card (thumbnail + metadata) ──────────────────────────────────────

function ContentCard({ item }: { item: ContentModalItem }) {
  const thumbUrl = `https://picsum.photos/seed/${item.thumbnailSeed}/163/104`;

  const statusVariant =
    (item.status === "Published with warning" || item.status === "Published with warnings")
      ? "Published with warnings"
      : item.status === "Not published"
        ? "Failed to publish"
        : undefined;

  return (
    <div className="rounded-[8px] bg-[#f5f5f5] px-6 py-6">
      <div className="flex gap-6">
        {/* Thumbnail */}
        <div className="h-[104px] w-[163px] shrink-0 overflow-hidden rounded-[4px] bg-[#e0e4e9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl}
            alt=""
            width={163}
            height={104}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <ContentTypeIcon type={item.contentType} />
            <p className="min-w-0 flex-1 truncate font-yahoo-product-sans text-[15px] font-semibold leading-5 text-[#232a31]">
              {item.title}
            </p>
          </div>
          <p className="line-clamp-2 font-yahoo-product-sans text-[12px] leading-4 text-[#6e7780]">
            {item.description}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {statusVariant && <PublishStatusLabel variant={statusVariant} />}
            <span className="font-yahoo-product-sans text-[13px] font-medium text-[#464e56]">
              {item.publishedAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main exported card component ──────────────────────────────────────────────

export function IssueDetailModalCard({
  item,
  data,
  onClose,
}: {
  item: ContentModalItem;
  data: IssueModalData;
  onClose: () => void;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const colors = COLORS[data.issueType];
  const badgeVariant =
    data.issueType === "warning" ? "Published with warnings" : "Failed to publish";
  const sectionTitle = data.issueType === "warning" ? "Warning" : "Failed to publish";

  return (
    <div
      className="flex max-h-[90vh] flex-col overflow-hidden rounded-[16px] bg-white"
      style={{
        boxShadow:
          "0px 0px 16px rgba(0,0,0,0.05), 0px 32px 32px -20px rgba(0,0,0,0.4)",
      }}
    >
      {/* ── Modal chrome header ── */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-6 pb-4 pt-6">
        <div className="flex items-center gap-3">
          <PublishStatusLabel variant={badgeVariant} />
          <h2 className="font-yahoo-product-sans text-[20px] font-bold leading-6 text-[#232a31]">
            {data.modalTitle}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="flex size-[40px] shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#f0f3f5]"
          aria-label="Close"
        >
          <Icon name={Cross} size="sm" variant="outline" className="size-5 text-[#464e56]" />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 pb-6">
        {/* Content card */}
        <ContentCard item={item} />

        {/* Metadata row */}
        <MetadataRow item={item} />

        {/* Issue section */}
        {data.variant === "single" && data.issues[0] ? (
          <>
            <SingleIssueSection
              issue={data.issues[0]}
              sectionTitle={sectionTitle}
              accent={colors.accent}
              bg={colors.bg}
            />
            <FooterRow footerType={data.footerType} borderTop />
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {data.issues.map((issue, idx) => (
              <AccordionItem
                key={issue.id}
                issue={issue}
                isExpanded={expandedIdx === idx}
                onToggle={() =>
                  setExpandedIdx((prev) => (prev === idx ? null : idx))
                }
                accent={colors.accent}
                bg={colors.bg}
                footerType={data.footerType}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
