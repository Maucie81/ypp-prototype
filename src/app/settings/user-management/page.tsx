"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@yahoo/uds";
import { MagnifyingGlass } from "@yahoo/uds-icons";
import { PageHeader } from "@/components/PageHeader";
import { TablePagination } from "@/components/TablePagination";
import { getMockUsers } from "@/lib/mockData";

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const totalRows = 1253;
  const users = useMemo(() => getMockUsers(), []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        actions={
          <button
            type="button"
            className="h-9 rounded-full bg-[#5D5EFF] px-4 py-2 font-yahoo-product-sans text-[14px] font-medium text-white hover:bg-[#4A4BE8]"
          >
            Add user
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex min-w-[280px] flex-1">
            <Icon
              name={MagnifyingGlass}
              size="sm"
              variant="outline"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#828a93]"
            />
            <input
              type="search"
              placeholder="Search by keyword"
              className="h-9 w-full rounded-[4px] border border-[#e0e4e9] bg-white py-2 pl-9 pr-3 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] placeholder:text-[#828a93] focus:border-[#5D5EFF] focus:outline-none focus:ring-1 focus:ring-[#5D5EFF]"
            />
          </div>
          <button
            type="button"
            className="h-[36px] rounded-full border border-[#e0e4e9] bg-white px-4 py-2 font-yahoo-product-sans text-[14px] font-medium text-[#232a31] hover:bg-[#f5f8fa]"
          >
            Sort by: Last name
          </button>
          <button
            type="button"
            className="h-[36px] rounded-full border border-[#e0e4e9] bg-white px-4 py-2 font-yahoo-product-sans text-[14px] font-medium text-[#232a31] hover:bg-[#f5f8fa]"
          >
            Brand filter
          </button>
        </div>
      </PageHeader>

      <div className="rounded-[8px] border border-[#f0f3f5] bg-white shadow-[0px_1px_2px_rgba(31,31,31,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-yahoo-product-sans text-[14px]">
            <thead>
              <tr className="border-b border-[#e0e4e9]">
                <th className="h-[33px] px-4 text-left font-semibold text-[#232a31]">
                  Full name
                </th>
                <th className="h-[33px] px-4 text-left font-semibold text-[#232a31]">
                  Email
                </th>
                <th className="h-[33px] px-4 text-left font-semibold text-[#232a31]">
                  Role
                </th>
                <th className="h-[33px] px-4 text-left font-semibold text-[#232a31]">
                  Brand
                </th>
                <th className="h-[33px] px-4 text-left font-semibold text-[#232a31]">
                  Last sign-in
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#f0f3f5] hover:bg-[#f5f8fa]"
                >
                  <td className="h-[52px] px-4">
                    <Link
                      href={`/settings/user-management/${user.id}`}
                      className="flex items-center gap-2 font-normal text-[#232a31] hover:underline"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E2E6FF] font-yahoo-product-sans text-[12px] font-medium text-[#232a31]">
                        {getInitials(user.firstName, user.lastName)}
                      </span>
                      <span className="flex items-center gap-2">
                        {user.fullName}
                        {user.deactivated && (
                          <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 font-yahoo-product-sans text-[12px] font-medium text-[#6e7780]">
                            Deactivated account
                          </span>
                        )}
                      </span>
                    </Link>
                  </td>
                  <td className="h-[52px] px-4 font-normal text-[#464e56]">
                    {user.email}
                  </td>
                  <td className="h-[52px] px-4 font-normal text-[#232a31]">
                    {user.role}
                  </td>
                  <td className="h-[52px] px-4 font-normal text-[#464e56]">
                    {user.brand}
                  </td>
                  <td className="h-[52px] px-4 font-normal text-[#464e56]">
                    {user.lastSignIn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          totalRows={totalRows}
          pageSize={pageSize}
          currentPage={page}
          onPageSizeChange={setPageSize}
          onPageChange={setPage}
          embedded
        />
      </div>
    </div>
  );
}
