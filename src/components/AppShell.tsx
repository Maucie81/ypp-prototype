"use client";

import { ReactNode, Suspense, useState } from "react";
import { TimeFilterProvider } from "@/contexts/TimeFilterContext";
import { GlobalHeader } from "./GlobalHeader";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
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

        {/* Main content: flex column, overflow hidden so pages fill viewport and scroll internally */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 pt-0 pb-8">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <TimeFilterProvider>{children}</TimeFilterProvider>
          </div>
        </main>
      </div>
    </div>
  );
}

