"use client";

/**
 * Trending up/down icons from design (Trending.svg / Trending-1.svg).
 * Use className to control color (e.g. text-[#56C470] for up, text-[#FF4D52] for down).
 */
type Direction = "up" | "down";

const PATHS: Record<Direction, string> = {
  up: "M15.8355 2.5H10.894V4.2H12.7448L7.00182 9.98142L3.92573 6.62554L0 10.6163L1.21192 11.8085L3.88221 9.09394L6.95241 12.4434L14.1355 5.21225V7.44148H15.8355V2.5Z",
  down: "M15.8355 13.5H10.894V11.8H12.7448L7.00182 6.01858L3.92573 9.37446L0 5.38368L1.21192 4.19152L3.88221 6.90606L6.95241 3.55662L14.1355 10.7877V8.55852H15.8355V13.5Z",
};

export function TrendingIcon({
  direction,
  className,
  "aria-hidden": ariaHidden = true,
}: {
  direction: Direction;
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <span
      className={`inline-block h-4 w-4 shrink-0 text-current ${className ?? ""}`}
      aria-hidden={ariaHidden}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path d={PATHS[direction]} fill="currentColor" />
      </svg>
    </span>
  );
}
