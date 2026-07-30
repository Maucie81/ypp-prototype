"use client";

import { useMemo } from "react";
import { PublishingVitalsDetail } from "@/components/PublishingVitalsDetail";
import { useTimeFilter } from "@/contexts/TimeFilterContext";
import {
  getPublishingVitalsKpis,
  getFeedVitalsRows,
  getIssuesDetected,
  getPublishingOutcomeSeries,
} from "@/lib/mockData";
import type { DateRangePreset } from "@/lib/mockData";

export default function FeedHealthPage() {
  const { range } = useTimeFilter();
  const rangePreset: DateRangePreset = range;

  const kpis = useMemo(
    () => getPublishingVitalsKpis(rangePreset),
    [rangePreset]
  );
  const feedRows = useMemo(
    () => getFeedVitalsRows(rangePreset),
    [rangePreset]
  );
  const issueRows = useMemo(
    () => getIssuesDetected(rangePreset),
    [rangePreset]
  );
  const publishingSeries = useMemo(
    () => getPublishingOutcomeSeries(rangePreset),
    [rangePreset]
  );

  return (
    <PublishingVitalsDetail
      kpis={kpis}
      feedRows={feedRows}
      issueRows={issueRows}
      publishingSeries={publishingSeries}
    />
  );
}
