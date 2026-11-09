import { Icon } from "@yahoo/uds";
import { Coin, FilmReel, Heart, Lightbulb, Newsletter, Trophy } from "@yahoo/uds-icons";

/**
 * Placeholder marks, not real logos. To use a real logo, replace a brand's entry here.
 * Unlisted brands fall back to initials.
 */
const BRAND_MARKS = {
  "Yahoo News": Newsletter,
  "Yahoo Sports": Trophy,
  "Yahoo Finance": Coin,
  "Yahoo Entertainment": FilmReel,
  "Yahoo Life": Heart,
  "Faire Design": Lightbulb,
} as const;

function isMarkedBrand(brand: string): brand is keyof typeof BRAND_MARKS {
  return brand in BRAND_MARKS;
}

/** Brand icon used in List of feeds (Feed health) and Top content table. Matches the tables' text color. */
export function BrandIcon({ brand }: { brand: string }) {
  if (isMarkedBrand(brand)) {
    return (
      <span
        role="img"
        aria-label={brand}
        title={brand}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center"
      >
        <Icon
          name={BRAND_MARKS[brand]}
          size="xs"
          variant="fill"
          className="size-3"
          style={{ color: "#232a31" } as React.CSSProperties}
        />
      </span>
    );
  }

  const initials = brand.replace("Yahoo ", "").slice(0, 2).toUpperCase();
  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border font-yahoo-product-sans text-[8px] font-bold text-[#464e56]"
      style={{ backgroundColor: "#F5F8FA", borderColor: "#E3E3E3" }}
      title={brand}
    >
      {initials}
    </span>
  );
}
