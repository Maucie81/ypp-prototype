/** Brand icon used in List of feeds (Feed health) and Top content table. Subtle fill #F5F8FA, border #E3E3E3. */
export function BrandIcon({ brand }: { brand: string }) {
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
