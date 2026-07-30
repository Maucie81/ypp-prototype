import type { RankedContentRow } from "@/lib/mockData";

export function RankedContentTable({ rows }: { rows: RankedContentRow[] }) {
  return (
    <div className="overflow-hidden rounded-[4px] bg-white">
      <table className="w-full table-fixed border-separate border-spacing-0">
        <colgroup>
          <col className="w-[49px]" />
          <col />
          <col className="w-[80px]" />
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              className="h-[33px] border-b border-[#e0e4e9] px-3 text-center align-middle font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]"
            >
              Rank
            </th>
            <th
              scope="col"
              className="h-[33px] border-b border-[#f0f3f5] px-3 text-left align-middle font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]"
            >
              Title
            </th>
            <th
              scope="col"
              className="h-[33px] border-b border-[#f0f3f5] px-3 text-center align-middle font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]"
            >
              Views
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const isLast = idx === rows.length - 1;
            const titleColor = isLast ? "#6e7780" : "#464e56";

            return (
              <tr key={row.rank}>
                <td
                  className={`h-[55.8px] bg-white px-3 py-3 text-center align-middle font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] ${
                    isLast ? "" : "border-b border-[#e3e3e3]"
                  }`}
                >
                  {row.rank}
                </td>
                <td
                  className={`h-[55.8px] bg-white px-3 py-3 text-left align-middle ${
                    isLast ? "" : "border-b border-[#e3e3e3]"
                  }`}
                >
                  <span
                    className="block min-w-0 truncate font-yahoo-product-sans text-[14px] font-medium leading-5 underline"
                    style={{ color: titleColor }}
                    title={row.title}
                  >
                    {row.title}
                  </span>
                </td>
                <td
                  className={`h-[55.8px] bg-white px-3 py-3 text-center align-middle font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] ${
                    isLast ? "" : "border-b border-[#e3e3e3]"
                  }`}
                >
                  {row.views.toLocaleString("en-US")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

