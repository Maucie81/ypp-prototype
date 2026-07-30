"use client";

/**
 * 12px directional arrow from Partner Portal Figma (variant=fill, size=12).
 * Partner Portal: O13AXE5XMVQSX9K8WhSKJ1, node 40000006-33896.
 * Rendered as mask so className (e.g. text-[#0c7a58]) controls color; rotated by direction.
 */
const FIGMA_ARROW_UP_12_FILL_URL =
  "https://www.figma.com/api/mcp/asset/890a4772-bbe6-4d1e-adc2-a1b1b89e9a50";

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
      className={`inline-block h-3 w-3 shrink-0 bg-current ${className ?? ""}`}
      style={{
        maskImage: `url(${FIGMA_ARROW_UP_12_FILL_URL})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: `url(${FIGMA_ARROW_UP_12_FILL_URL})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        transform: `rotate(${ROTATION[direction]})`,
      }}
      aria-hidden={ariaHidden}
    />
  );
}
