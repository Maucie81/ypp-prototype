"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { TablePagination } from "@/components/TablePagination";
import { TopContentTable } from "@/components/TopContentTable";
import { FilterBar } from "@/components/filters/FilterBar";
import { useTimeFilter } from "@/contexts/TimeFilterContext";
import { getTopContentRows } from "@/lib/mockData";
import type { DateRangePreset } from "@/lib/mockData";

export default function TopContentPage() {
  const { range } = useTimeFilter();
  const rangePreset: DateRangePreset = range;
  const rows = useMemo(() => getTopContentRows(rangePreset), [rangePreset]);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const start = (currentPage - 1) * pageSize;
  const paginatedRows = useMemo(
    () => rows.slice(start, start + pageSize),
    [rows, start, pageSize]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Top content"
        titleClassName="font-yahoo-product-sans text-[24px] font-bold leading-7 text-[#232a31]"
        sticky={false}
        slotClassName="pb-0"
      >
        <section aria-label="Filters" className="w-full">
          <FilterBar variant="contentPerformance" />
        </section>
      </PageHeader>

      {/* 8px between filters and table header */}
      <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
        <TopContentTable rows={paginatedRows} fixedHeaderLayout />
      </div>

      {/* Pagination docks at bottom (main has pb-8 = 32px from viewport bottom) */}
      <div className="shrink-0 border-t border-[#f0f3f5] bg-white">
        <TablePagination
          totalRows={rows.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          onPageChange={setCurrentPage}
          embedded
        />
      </div>
    </div>
  );
}
