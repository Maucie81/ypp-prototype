"use client";

/**
 * 12px directional arrow from Partner Portal Figma (variant=fill, size=12).
 * Partner Portal: O13AXE5XMVQSX9K8WhSKJ1, node 40000006-33896.
 */
type Direction = "up" | "down" | "left" | "right";

const ROTATION: Record<Direction, string> = {
  up: "0deg",
  down: "180deg",
  left: "-90deg",
  right: "90deg",
};

export function DeltaArrowIcon({
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
      className={`inline-block h-3 w-3 shrink-0 text-current ${className ?? ""}`}
      style={{ transform: `rotate(${ROTATION[direction]})` }}
      aria-hidden={ariaHidden}
    >
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <path d="M5 0L0 5.2851L1.14658 6.47387L4.19313 3.2536L4.19313 12H5.80687V3.2536L8.85342 6.47387L10 5.2851L5 0Z" fill="currentColor" />
      </svg>
    </span>
  );
}
