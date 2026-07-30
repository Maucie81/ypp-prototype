/**
 * Status chip matching Figma PublishStatusLabel (node 6751:77442).
 * All chips: padding 4px 6px, text 12px medium #232a31, border-radius 4px flat (not pill).
 */
export type PublishStatusLabelVariant =
  | "Active"
  | "Paused"
  | "Deleted"
  | "Published"
  | "Not published"
  | "Published with warning"
  // Full-text variants used in issue detail page content lists
  | "Published with warnings"
  | "Failed to publish";

const STYLES: Record<
  PublishStatusLabelVariant,
  { bg: string; border: string }
> = {
  Active: { bg: "#f6fff4", border: "#008751" },
  Paused: { bg: "#fffdee", border: "#e5b917" },
  Deleted: { bg: "#f5f8fa", border: "#828a93" },
  Published: { bg: "#f0f3f5", border: "#e0e4e9" },
  "Not published": { bg: "#fffafa", border: "#d30d2e" },
  "Published with warning": { bg: "#fff9f2", border: "#e26900" },
  "Published with warnings": { bg: "#fff9f2", border: "#e26900" },
  "Failed to publish": { bg: "#fffafa", border: "#d30d2e" },
};

const LABELS: Record<PublishStatusLabelVariant, string> = {
  Active: "Active",
  Paused: "Paused",
  Deleted: "Deleted",
  Published: "Published",
  "Not published": "Failure",
  "Published with warning": "Warning",
  "Published with warnings": "Warning",
  "Failed to publish": "Failed",
};

export function PublishStatusLabel({
  variant,
}: {
  variant: PublishStatusLabelVariant;
}) {
  const { bg, border } = STYLES[variant];
  return (
    <span
      className="inline-flex items-center font-yahoo-product-sans text-[12px] font-medium leading-4 text-[#232a31]"
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: 4,
        padding: "4px 6px",
      }}
    >
      {LABELS[variant]}
    </span>
  );
}
