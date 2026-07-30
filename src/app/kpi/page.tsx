import { Suspense } from "react";
import { ContentPerformanceDetail } from "./ContentPerformanceDetail";

export default function ContentPerformancePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center text-[#6e7780]">
          Loading…
        </div>
      }
    >
      <ContentPerformanceDetail />
    </Suspense>
  );
}

