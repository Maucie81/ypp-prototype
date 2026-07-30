import Link from "next/link";
import { Icon } from "@yahoo/uds";
import { Home } from "@yahoo/uds-icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4">
      <p className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#6e7780]">
        404
      </p>
      <h1 className="font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#232a31]">
        This page could not be found.
      </h1>
      <Link
        href="/"
        className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[#e0e4e9] bg-white px-4 py-2 font-yahoo-product-sans text-[14px] font-medium text-[#232a31] shadow-[0px_1px_2px_rgba(31,31,31,0.05)] hover:border-[#232a31] hover:bg-[#f5f8fa]"
      >
        <Icon name={Home} size="sm" variant="outline" className="h-4 w-4" />
        Go to Overview
      </Link>
    </div>
  );
}
