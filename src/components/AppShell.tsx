"use client";

import { ReactNode, Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { TimeFilterProvider } from "@/contexts/TimeFilterContext";
import { BrandProvider } from "@/contexts/BrandContext";
import { GlobalHeader } from "./GlobalHeader";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  return (
    <BrandProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-white text-[#232a31]">
        {/* Sticky global header */}
        <div className="relative z-50 shrink-0">
          <GlobalHeader
            onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Body row: sticky sidebar + scrollable main */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sticky left sidebar */}
          <div
            className={`shrink-0 ${
              sidebarCollapsed ? "w-[52px]" : "w-[252px]"
            }`}
          >
            <Suspense
              fallback={
                <div className="h-full w-full border-r border-[#f0f3f5] bg-[#f5f5f5]" />
              }
            >
              <Sidebar collapsed={sidebarCollapsed} />
            </Suspense>
          </div>

          {/* Main content — inner content capped at 1188px (1440 - 252px sidebar) */}
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden overflow-y-auto">
            <div className="flex min-h-0 flex-1 flex-col mx-auto w-full max-w-[1188px] px-8 pb-10">
              <TimeFilterProvider>{children}</TimeFilterProvider>
            </div>
          </main>
        </div>
      </div>
    </BrandProvider>
  );
}

