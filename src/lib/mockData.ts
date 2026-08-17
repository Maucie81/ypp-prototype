import { faker } from "@faker-js/faker";

export type KpiId =
  | "traffic"
  | "revenue"
  | "ctr"
  | "errorRate"
  | "activeFeeds"
  | "fillRate"
  | "avgPosition"
  | "contentItems";

export interface KpiMetric {
  id: KpiId;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  helperText: string;
  unit?: string;
}

/** Primary KPI with sparkline data for Overview cards. */
export interface PrimaryKpiMetric extends KpiMetric {
  sparklineData: number[];
  sparklineXLabels: string[];
  comparisonDate?: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface KpiDetail extends KpiMetric {
  description: string;
  timeSeries: TimeSeriesPoint[];
}

export interface FeedSummary {
  id: string;
  name: string;
  vertical: string;
  status: "healthy" | "warning" | "error";
  errorRate: number;
  lastIngestedAt: string;
  issuesOpen: number;
}

export type IssueSeverity = "low" | "medium" | "high" | "critical";

export interface Issue {
  id: string;
  feedId: string;
  feedName: string;
  title: string;
  code: string;
  severity: IssueSeverity;
  firstSeenAt: string;
  lastSeenAt: string;
  affectedItems: number;
  recommendedActions: string[];
  technicalDetails: string;
}

faker.seed(20260227);

export type PublishingOutcomeSeries = {
  xLabels: string[];
  published: number[];
  publishedWithWarnings: number[];
  failedToPublish: number[];
};

export type VideoSeriesData = {
  xLabels: string[];
  streams: number[];
  streamers: number[];
  watchMinutes: number[];
  medianView: number[];
  completion: number[];
};

export function getVideoSeriesData(range?: DateRangePreset, brandId?: string): VideoSeriesData {
  const seedKey = `video-series-${range ?? "default"}-${brandId ?? ""}`;
  faker.seed(seedKey.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227 + brandSeedOffset(brandId)));
  const { count, hourLabels } = getChartConfig(range);
  const base = new Date();
  if (hourLabels) {
    base.setHours(base.getHours() - (count - 1), 0, 0, 0);
  } else {
    base.setDate(base.getDate() - (count - 1));
    base.setHours(0, 0, 0, 0);
  }
  const msPerStep = hourLabels ? 3_600_000 : 86_400_000;

  const xLabels: string[] = [];
  const streams: number[] = [];
  const streamers: number[] = [];
  const watchMinutes: number[] = [];
  const medianView: number[] = [];
  const completion: number[] = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(base.getTime() + i * msPerStep);
    xLabels.push(hourLabels ? HOUR_LABELS_24[i] : formatMMDD(d));
    streams.push(faker.number.int({ min: 5, max: 95 }));
    streamers.push(faker.number.int({ min: 5, max: 90 }));
    watchMinutes.push(faker.number.int({ min: 10, max: 95 }));
    medianView.push(faker.number.int({ min: 5, max: 80 }));
    completion.push(faker.number.int({ min: 20, max: 90 }));
  }

  const out = { xLabels, streams, streamers, watchMinutes, medianView, completion };
  if (range) faker.seed(20260227);
  return out;
}

function formatMMDD(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m}/${d}`;
}

/** Optional date range for filter-driven data. Used to seed data per range. */
export type DateRangePreset = "last7" | "last30" | "last14" | "last24h" | "mtd";

function brandSeedOffset(brandId?: string): number {
  if (!brandId || brandId === "datapulse-main") return 0;
  return brandId.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 1000;
}

/** Chart point count and whether X axis is hours (for last24h). */
function getChartConfig(range?: DateRangePreset): { count: number; hourLabels: boolean } {
  switch (range) {
    case "last30":
      return { count: 30, hourLabels: false };
    case "last14":
      return { count: 14, hourLabels: false };
    case "last7":
      return { count: 7, hourLabels: false };
    case "last24h":
      return { count: 24, hourLabels: true };
    case "mtd":
    default:
      return { count: 7, hourLabels: false };
  }
}

function getComparisonDateString(range?: DateRangePreset): string {
  const today = new Date();
  let daysBack: number;

  switch (range) {
    case "last30":
      daysBack = 60;
      break;
    case "last14":
      daysBack = 28;
      break;
    case "last7":
      daysBack = 14;
      break;
    case "last24h":
      daysBack = 2;
      break;
    case "mtd":
    default:
      daysBack = 14;
  }

  const comparisonDate = new Date(today);
  comparisonDate.setDate(comparisonDate.getDate() - daysBack);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[comparisonDate.getMonth()];
  const day = comparisonDate.getDate();
  const year = comparisonDate.getFullYear();

  return `${month} ${day}, ${year}`;
}

const HOUR_LABELS_24 = [
  "12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am",
  "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm",
];

export function getPublishingOutcomeSeries(range?: DateRangePreset, brandId?: string): PublishingOutcomeSeries {
  const seed = `${range ?? "default"}-outcome-${brandId ?? ""}`;
  faker.seed(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227 + brandSeedOffset(brandId)));

  const { count, hourLabels } = getChartConfig(range);
  const base = new Date();
  if (hourLabels) {
    base.setHours(base.getHours() - (count - 1), 0, 0, 0);
  } else {
    base.setDate(base.getDate() - (count - 1));
    base.setHours(0, 0, 0, 0);
  }

  const xLabels: string[] = [];
  const published: number[] = [];
  const publishedWithWarnings: number[] = [];
  const failedToPublish: number[] = [];

  const msPerStep = hourLabels ? 3_600_000 : 86_400_000;
  for (let i = 0; i < count; i++) {
    const d = new Date(base.getTime() + i * msPerStep);
    xLabels.push(hourLabels ? HOUR_LABELS_24[i] : formatMMDD(d));

    // Vary the mix per bar: success-heavy, warning-heavy, failure-heavy, or balanced
    const mix = faker.helpers.arrayElement([
      "success",
      "warnings",
      "failure",
      "balanced",
    ]);
    let p: number, w: number;
    switch (mix) {
      case "success":
        p = faker.number.int({ min: 68, max: 90 });
        w = faker.number.int({ min: 5, max: 20 });
        break;
      case "warnings":
        p = faker.number.int({ min: 28, max: 48 });
        w = faker.number.int({ min: 32, max: 50 });
        break;
      case "failure":
        p = faker.number.int({ min: 20, max: 45 });
        w = faker.number.int({ min: 10, max: 25 });
        break;
      default:
        p = faker.number.int({ min: 40, max: 55 });
        w = faker.number.int({ min: 22, max: 38 });
    }
    p = Math.min(100, Math.max(0, p));
    w = Math.min(100 - p, Math.max(0, w));
    const f = 100 - p - w;
    published.push(p);
    publishedWithWarnings.push(w);
    failedToPublish.push(f);
  }

  faker.seed(20260227);
  return { xLabels, published, publishedWithWarnings, failedToPublish };
}

const kpiMetrics: KpiDetail[] = [
  {
    id: "traffic",
    label: "Views",
    value: faker.number.int({ min: 8_000_000, max: 16_000_000 }).toLocaleString(
      "en-US",
    ),
    unit: "",
    delta: "+8.2%",
    trend: "up",
    helperText: "Total content views. This is specific to the article/content view and is distinct from classic \"page views\" (which might historically include separate clicks on slideshows).",
    description:
      "Total page views across all Yahoo surfaces for this partner.",
    timeSeries: Array.from({ length: 14 }).map((_, i) => ({
      timestamp: faker.date
        .recent({ days: 14, refDate: Date.now() - i * 86_400_000 })
        .toISOString(),
      value: faker.number.int({ min: 300_000, max: 1_400_000 }),
    })),
  },
  {
    id: "revenue",
    label: "Items published",
    value: faker.number.int({ min: 50_000, max: 250_000 }).toLocaleString("en-US"),
    unit: "",
    delta: "+3.5%",
    trend: "up",
    helperText: "The total volume of content items/headlines successfully ingested.",
    description:
      "Total content items published to Yahoo surfaces in the selected period.",
    timeSeries: Array.from({ length: 14 }).map((_, i) => ({
      timestamp: faker.date
        .recent({ days: 14, refDate: Date.now() - i * 86_400_000 })
        .toISOString(),
      value: faker.number.int({ min: 2_000, max: 20_000 }),
    })),
  },
  {
    id: "ctr",
    label: "Unique visitors",
    value: faker.number.int({ min: 1_000_000, max: 8_000_000 }).toLocaleString("en-US"),
    unit: "",
    delta: "+0.12 pts",
    trend: "up",
    helperText: "The number of individual content viewers. This counts each person only once, regardless of how many times they view the content.",
    description:
      "Unique visitors who interacted with this partner's content.",
    timeSeries: Array.from({ length: 14 }).map((_, i) => ({
      timestamp: faker.date
        .recent({ days: 14, refDate: Date.now() - i * 86_400_000 })
        .toISOString(),
      value: faker.number.float({ min: 0.8, max: 2.6 }),
    })),
  },
  {
    id: "errorRate",
    label: "Reach",
    value: faker.number.int({ min: 2_000_000, max: 12_000_000 }).toLocaleString("en-US"),
    unit: "",
    delta: "+0.11 pts",
    trend: "down",
    helperText: "Headline impressions. This represents the total \"volume of eyes\" that have seen a story's headline within a stream or homepage feed.",
    description:
      "Total number of users exposed to this partner's content.",
    timeSeries: Array.from({ length: 14 }).map((_, i) => ({
      timestamp: faker.date
        .recent({ days: 14, refDate: Date.now() - i * 86_400_000 })
        .toISOString(),
      value: faker.number.float({ min: 0.1, max: 1.2 }),
    })),
  },
  {
    id: "activeFeeds",
    label: "CTR",
    value: `${faker.number.float({ min: 0.9, max: 2.4 }).toFixed(2)}%`,
    unit: "%",
    delta: "No change",
    trend: "neutral",
    helperText: "The ratio of content views to reach. It measures the conversion rate of a headline impression driving a user to actually view the content.",
    description: "Click-through rate across all impressions for this partner.",
    timeSeries: Array.from({ length: 14 }).map((_, i) => ({
      timestamp: faker.date
        .recent({ days: 14, refDate: Date.now() - i * 86_400_000 })
        .toISOString(),
      value: faker.number.int({ min: 170, max: 210 }),
    })),
  },
  {
    id: "fillRate",
    label: "Video streams",
    value: faker.number.int({ min: 100_000, max: 2_000_000 }).toLocaleString("en-US"),
    unit: "",
    delta: "+1.2 pts",
    trend: "up",
    helperText: "Total video stream starts attributed to this partner's content across all Yahoo surfaces.",
    description: "Number of video stream starts attributed to this partner.",
    timeSeries: Array.from({ length: 14 }).map((_, i) => ({
      timestamp: faker.date
        .recent({ days: 14, refDate: Date.now() - i * 86_400_000 })
        .toISOString(),
      value: faker.number.float({ min: 90, max: 99 }),
    })),
  },
  {
    id: "avgPosition",
    label: "Average dwell per item",
    value: `${faker.number.float({ min: 45, max: 180 }).toFixed(0)}s`,
    unit: "s",
    delta: "-0.3",
    trend: "up",
    helperText: "The average time spent on the article page, tracked in seconds.",
    description: "Mean dwell time per content item across all partner surfaces.",
    timeSeries: Array.from({ length: 14 }).map((_, i) => ({
      timestamp: faker.date
        .recent({ days: 14, refDate: Date.now() - i * 86_400_000 })
        .toISOString(),
      value: faker.number.float({ min: 2, max: 5 }),
    })),
  },
  {
    id: "contentItems",
    label: "Comments per item",
    value: faker.number.float({ min: 0.8, max: 12.4 }).toFixed(1),
    unit: "",
    delta: "+5.1%",
    trend: "up",
    helperText: "Calculated as the sum of comment posts, replies, and votes divided by the total content count.",
    description: "Mean comment count per item in the selected period.",
    timeSeries: Array.from({ length: 14 }).map((_, i) => ({
      timestamp: faker.date
        .recent({ days: 14, refDate: Date.now() - i * 86_400_000 })
        .toISOString(),
      value: faker.number.int({ min: 5_000, max: 20_000 }),
    })),
  },
];

const feeds: FeedSummary[] = Array.from({ length: 24 }).map(() => {
  const statusRoll = faker.number.int({ min: 1, max: 100 });
  const status: FeedSummary["status"] =
    statusRoll > 80 ? "error" : statusRoll > 60 ? "warning" : "healthy";

  return {
    id: faker.string.uuid(),
    name: `${faker.company.name()} - ${faker.helpers.arrayElement([
      "News",
      "Finance",
      "Sports",
      "Entertainment",
    ])}`,
    vertical: faker.helpers.arrayElement([
      "News",
      "Finance",
      "Sports",
      "Entertainment",
    ]),
    status,
    errorRate: Number(
      faker.number.float({ min: 0, max: status === "healthy" ? 0.3 : 2 }).toFixed(2),
    ),
    lastIngestedAt: faker.date.recent({ days: 2 }).toISOString(),
    issuesOpen:
      status === "healthy"
        ? 0
        : faker.number.int({ min: 1, max: status === "error" ? 7 : 3 }),
  };
});

const issues: Issue[] = feeds.flatMap((feed) => {
  if (feed.status === "healthy") return [];

  const count = faker.number.int({
    min: 1,
    max: feed.status === "error" ? 4 : 2,
  });

  return Array.from({ length: count }).map(() => {
    const severity = faker.helpers.arrayElement<IssueSeverity>([
      "low",
      "medium",
      "high",
      "critical",
    ]);

    return {
      id: faker.string.uuid(),
      feedId: feed.id,
      feedName: feed.name,
      title: faker.helpers.arrayElement([
        "High 5xx response rate from origin",
        "Stale sitemap detected",
        "Missing required image field",
        "Invalid canonical URL format",
        "Unexpected drop in items ingested",
      ]),
      code: faker.helpers.arrayElement([
        "FEED_5XX",
        "FEED_STALE_SITEMAP",
        "FEED_MISSING_IMAGE",
        "FEED_INVALID_CANONICAL",
        "FEED_INGESTION_DROP",
      ]),
      severity,
      firstSeenAt: faker.date.recent({ days: 14 }).toISOString(),
      lastSeenAt: faker.date.recent({ days: 2 }).toISOString(),
      affectedItems: faker.number.int({ min: 10, max: 5_000 }),
      recommendedActions: [
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
      ],
      technicalDetails: faker.lorem.paragraphs({ min: 1, max: 2 }),
    };
  });
});

export function getOverviewKpis(): KpiMetric[] {
  return kpiMetrics.map((kpi) => {
    const { timeSeries, description, ...rest } = kpi;
    void timeSeries;
    void description;
    return rest;
  });
}

/** First 2 KPIs for the overview primary (large) chip row, with sparkline data. */
function generateSparklineXLabels(range?: DateRangePreset): string[] {
  const { count, hourLabels } = getChartConfig(range);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const labels: string[] = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = count - 1; i >= 0; i--) {
    if (hourLabels) {
      labels.push(HOUR_LABELS_24[count - 1 - i] ?? "");
    } else {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      labels.push(monthNames[d.getMonth()]!);
    }
  }
  return labels;
}

export function getOverviewPrimaryKpis(range?: DateRangePreset, brandId?: string): PrimaryKpiMetric[] {
  const pointCount = getChartConfig(range).count;
  const comparisonDate = getComparisonDateString(range);
  const sparklineXLabels = generateSparklineXLabels(range);
  const baseSeed = 20260227 + brandSeedOffset(brandId);
  const seedKey = `overview-primary-${range ?? "default"}-${brandId ?? ""}`;
  faker.seed(seedKey.split("").reduce((a, c) => a + c.charCodeAt(0), baseSeed));
  const out = kpiMetrics.slice(0, 2).map((kpi) => {
    const sparklineData = Array.from({ length: pointCount }, () =>
      faker.number.int({ min: kpi.timeSeries[0]!.value * 0.4, max: kpi.timeSeries[0]!.value * 1.6 })
    );
    const value = faker.number.int({ min: 1_000_000, max: 15_000_000 }).toLocaleString("en-US");
    const deltaNum = faker.number.float({ min: -30, max: 50, fractionDigits: 1 });
    const delta = `${deltaNum >= 0 ? "+" : ""}${deltaNum}%`;
    const trend: "up" | "down" | "neutral" = deltaNum > 0.5 ? "up" : deltaNum < -0.5 ? "down" : "neutral";
    return {
      ...kpi,
      value,
      delta,
      trend,
      sparklineData,
      sparklineXLabels,
      comparisonDate,
    };
  });
  faker.seed(20260227);
  return out;
}

/** Next 6 KPIs for the overview secondary (small) chip grid. */
export function getOverviewSecondaryKpis(range?: DateRangePreset, brandId?: string): (KpiMetric & { comparisonDate: string })[] {
  const comparisonDate = getComparisonDateString(range);
  const baseSeed = 20260227 + brandSeedOffset(brandId);
  const seedKey = `overview-secondary-${range ?? "default"}-${brandId ?? ""}`;
  faker.seed(seedKey.split("").reduce((a, c) => a + c.charCodeAt(0), baseSeed));
  const out = kpiMetrics.slice(2, 8).map((kpi) => {
    const deltaNum = faker.number.float({ min: -20, max: 40, fractionDigits: 2 });
    const delta = kpi.unit === "%"
      ? `${deltaNum >= 0 ? "+" : ""}${Math.abs(deltaNum).toFixed(2)} pts`
      : `${deltaNum >= 0 ? "+" : ""}${deltaNum.toFixed(1)}%`;
    const trend: "up" | "down" | "neutral" = deltaNum > 0.5 ? "up" : deltaNum < -0.5 ? "down" : "neutral";
    return { ...kpi, delta, trend, comparisonDate };
  });
  faker.seed(20260227);
  return out;
}

export function getKpiDetail(id: KpiId): KpiDetail | undefined {
  return kpiMetrics.find((kpi) => kpi.id === id);
}

export function getFeeds(): FeedSummary[] {
  return feeds;
}

export function getIssues(): Issue[] {
  return issues;
}

export function getIssueById(id: string): Issue | undefined {
  return issues.find((issue) => issue.id === id);
}

// ─── Feed health ─────────────────────────────────────────────────────────────

export interface PublishingVitalsKpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  helperText: string;
}

export type FeedContentType = "video" | "article" | "slideshow";

export interface FeedVitalsRow {
  id: string;
  status: "Active" | "Paused" | "Deleted";
  contentType: FeedContentType;
  name: string;
  brand: string;
  success: number;
  lastRun: string;
  avgLatency: number;
  created: string;
}

export interface IssueSummaryRow {
  id: string;
  issue: string;
  type: "published_with_warning" | "not_published";
  trend: number[];
  volume: number;
}

function fmtDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(2)}`;
}

const BRANDS = [
  "Yahoo News",
  "Yahoo Sports",
  "Yahoo Finance",
  "Yahoo Entertainment",
  "Yahoo Life",
];

const FEED_NAMES: Record<string, string[]> = {
  "Yahoo News": ["Yahoo News · Video · EN · US", "Yahoo News · Article · EN · US", "Yahoo News · Video · EN · CA", "Yahoo News · Slideshow · EN · US"],
  "Yahoo Sports": ["Yahoo Sports · Video · EN · US", "Yahoo Sports · Article · EN · US", "Yahoo Sports · Slideshow · EN · US"],
  "Yahoo Finance": ["Yahoo Finance · Article · EN · US", "Yahoo Finance · Video · EN · UK", "Yahoo Finance · Slideshow · EN · US"],
  "Yahoo Entertainment": ["Yahoo Entertainment · Video · EN · US", "Yahoo Entertainment · Article · EN · US"],
  "Yahoo Life": ["Yahoo Life · Article · EN · US", "Yahoo Life · Video · EN · AU", "Yahoo Life · Slideshow · EN · US"],
};

function getFeedVitalsRowsInternal(range?: DateRangePreset): FeedVitalsRow[] {
  const previousSeed = 20260227;
  if (range) {
    const seed = `feed-vitals-${range}`;
    faker.seed(seed.split("").reduce((a, c) => a + c.charCodeAt(0), previousSeed));
  }
  const rows = Array.from({ length: 50 }).map(() => {
    const statusRoll = faker.number.int({ min: 1, max: 100 });
    const status: FeedVitalsRow["status"] =
      statusRoll > 85 ? "Deleted" : statusRoll > 65 ? "Paused" : "Active";
    const brand = faker.helpers.arrayElement(BRANDS);
    const names = FEED_NAMES[brand];
    const success =
      status === "Active"
        ? faker.number.int({ min: 92, max: 100 })
        : status === "Paused"
          ? faker.number.int({ min: 70, max: 92 })
          : faker.number.int({ min: 30, max: 70 });
    const createdDate = faker.date.past({ years: 2 });
    const lastRunDate = faker.date.recent({ days: 7 });

    return {
      id: faker.string.alphanumeric({ length: 7, casing: "mixed" }),
      status,
      contentType: faker.helpers.arrayElement(["video", "article", "slideshow"] as const),
      name: faker.helpers.arrayElement(names),
      brand,
      success,
      lastRun: fmtDate(lastRunDate),
      avgLatency: faker.number.int({ min: 45, max: 220 }),
      created: fmtDate(createdDate),
    };
  });
  if (range) faker.seed(previousSeed);
  return rows;
}

const ISSUE_POOL = [
  "High tragedy score",
  "Missing required image field",
  "Invalid canonical URL format",
  "Stale sitemap detected",
  "High 5xx response rate",
  "Schema validation failed",
  "Unexpected drop in items ingested",
];

const issueSummaryRows: IssueSummaryRow[] = Array.from({ length: 25 }).map(() => {
  const type = faker.helpers.arrayElement([
    "published_with_warning",
    "not_published",
  ] as const);
  // Generate a wavy trend with 8 data points
  let v = faker.number.int({ min: 1500, max: 3500 });
  const trend = Array.from({ length: 8 }).map(() => {
    v = Math.max(200, Math.min(5000, v + faker.number.int({ min: -600, max: 600 })));
    return v;
  });

  return {
    id: faker.string.uuid(),
    issue: faker.helpers.arrayElement(ISSUE_POOL),
    type,
    trend,
    volume: faker.number.int({ min: 800, max: 4500 }),
  };
});

const publishingVitalsKpis: PublishingVitalsKpi[] = [
  {
    id: "success-rate",
    label: "Content success rate",
    value: `${faker.number.float({ min: 88, max: 98 }).toFixed(1)}%`,
    delta: "+3.1%",
    trend: "up",
    helperText: "Percentage of content items that were successfully processed and published without errors.",
  },
  {
    id: "total-items",
    label: "Total items",
    value: faker.number.int({ min: 2_500, max: 8_000 }).toLocaleString("en-US"),
    delta: "+12.5%",
    trend: "up",
    helperText: "Total volume of content items ingested across all feeds in the selected period.",
  },
  {
    id: "feed-uptime",
    label: "Feed uptime",
    value: `${faker.number.float({ min: 97, max: 99.9 }).toFixed(1)}%`,
    delta: "+0.2%",
    trend: "up",
    helperText: "Percentage of time feeds were available and processing successfully.",
  },
  {
    id: "published",
    label: "Published",
    value: faker.number.int({ min: 2_000, max: 6_000 }).toLocaleString("en-US"),
    delta: "-5.4%",
    trend: "down",
    helperText: "Content items that were fully published to Yahoo surfaces.",
  },
  {
    id: "published-with-warnings",
    label: "Published with warnings",
    value: faker.number.int({ min: 200, max: 1_200 }).toLocaleString("en-US"),
    delta: "+8.3%",
    trend: "up",
    helperText: "Items published successfully but with one or more non-blocking quality warnings.",
  },
  {
    id: "failed-to-publish",
    label: "Failed to publish",
    value: faker.number.int({ min: 30, max: 350 }).toLocaleString("en-US"),
    delta: "-18.2%",
    trend: "down",
    helperText: "Items that could not be published due to critical errors.",
  },
];

export function getPublishingVitalsKpis(range?: DateRangePreset): PublishingVitalsKpi[] {
  if (range) {
    const seed = `vitals-kpis-${range}`;
    faker.seed(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));
    const out = [
      { id: "success-rate", label: "Content success rate", value: `${faker.number.float({ min: 88, max: 98 }).toFixed(1)}%`, delta: "+3.1%", trend: "up" as const, helperText: "Percentage of content items that were successfully processed and published without errors." },
      { id: "total-items", label: "Total items", value: faker.number.int({ min: 2_500, max: 8_000 }).toLocaleString("en-US"), delta: "+12.5%", trend: "up" as const, helperText: "Total volume of content items ingested across all feeds in the selected period." },
      { id: "feed-uptime", label: "Feed uptime", value: `${faker.number.float({ min: 97, max: 99.9 }).toFixed(1)}%`, delta: "+0.2%", trend: "up" as const, helperText: "Percentage of time feeds were available and processing successfully." },
      { id: "published", label: "Published", value: faker.number.int({ min: 2_000, max: 6_000 }).toLocaleString("en-US"), delta: "-5.4%", trend: "down" as const, helperText: "Content items that were fully published to Yahoo surfaces." },
      { id: "published-with-warnings", label: "Published with warnings", value: faker.number.int({ min: 200, max: 1_200 }).toLocaleString("en-US"), delta: "+8.3%", trend: "up" as const, helperText: "Items published successfully but with one or more non-blocking quality warnings." },
      { id: "failed-to-publish", label: "Failed to publish", value: faker.number.int({ min: 30, max: 350 }).toLocaleString("en-US"), delta: "-18.2%", trend: "down" as const, helperText: "Items that could not be published due to critical errors." },
    ];
    faker.seed(20260227);
    return out;
  }
  return publishingVitalsKpis;
}

export function getFeedVitalsRows(range?: DateRangePreset): FeedVitalsRow[] {
  return getFeedVitalsRowsInternal(range);
}

export function getFeedVitalsRowById(id: string, range?: DateRangePreset): FeedVitalsRow | undefined {
  // IDs are seed-dependent per range, so try all presets to find the feed
  const allPresets: (DateRangePreset | undefined)[] = [range, "last7", "last30", "last14", "last24h", "mtd", undefined];
  for (const preset of allPresets) {
    const row = getFeedVitalsRowsInternal(preset).find((r) => r.id === id);
    if (row) return row;
  }
  return undefined;
}

export function getIssuesDetected(range?: DateRangePreset): IssueSummaryRow[] {
  if (range) {
    const seed = `issues-detected-${range}`;
    faker.seed(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));
    const out = Array.from({ length: 25 }).map(() => {
      const type = faker.helpers.arrayElement(["published_with_warning", "not_published"] as const);
      let v = faker.number.int({ min: 1500, max: 3500 });
      const trend = Array.from({ length: 8 }).map(() => {
        v = Math.max(200, Math.min(5000, v + faker.number.int({ min: -600, max: 600 })));
        return v;
      });
      return {
        id: faker.string.uuid(),
        issue: faker.helpers.arrayElement(ISSUE_POOL),
        type,
        trend,
        volume: faker.number.int({ min: 800, max: 4500 }),
      };
    });
    faker.seed(20260227);
    return out;
  }
  return issueSummaryRows;
}

export interface RankedContentRow {
  rank: number;
  title: string;
  views: number;
}

/** Full row for Top content dedicated page. Columns: Rank, Content title/type, Brand, Views, Visitors, Reach, CTR, Dwell, Engagements. */
export interface TopContentRow {
  rank: number;
  contentTitle: string;
  contentType: string;
  brand: string;
  views: number;
  visitors: number;
  reach: number;
  ctr: number;
  dwell: number;
  engagements: number;
}

export interface BrandComparisonRow {
  rank: number;
  brand: string;
  views: number;
  reach: number;
  ctr: number;
  averageDwell: number;
  comments: number;
  contentCount: number;
}

export type ContentMetricTab =
  | "views"
  | "reach"
  | "uniques"
  | "dwell"
  | "comments"
  | "ctr";

export interface ContentPerformancePoint {
  dateLabel: string; // e.g. 1/14
  value: number; // 0-100 chart value
}

export interface ContentPerformanceRow {
  date: string; // e.g. 1/23/25
  value: number;
}

export interface ContentPerformanceMetricData {
  points: ContentPerformancePoint[];
  rows: ContentPerformanceRow[];
}

export function getContentPerformanceMetricData(
  metric: ContentMetricTab,
  range?: DateRangePreset,
): ContentPerformanceMetricData {
  if (range) {
    const seed = `content-perf-${metric}-${range}`;
    faker.seed(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));
  }
  const { count, hourLabels } = getChartConfig(range);
  const base = new Date();
  if (hourLabels) {
    base.setHours(base.getHours() - (count - 1), 0, 0, 0);
  } else {
    base.setDate(base.getDate() - (count - 1));
    base.setHours(0, 0, 0, 0);
  }
  const dateLabels: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(base.getTime() + i * (hourLabels ? 3_600_000 : 86_400_000));
    dateLabels.push(hourLabels ? HOUR_LABELS_24[i] : formatMMDD(d));
  }
  const fullDates = hourLabels ? dateLabels.map((_, i) => `Hour ${i + 1}`) : dateLabels.map((d) => `${d}/25`);

  const randomWalk = (start: number) => {
    let v = start;
    return dateLabels.map(() => {
      v = Math.max(5, Math.min(98, v + faker.number.int({ min: -22, max: 22 })));
      return v;
    });
  };

  const start =
    metric === "ctr"
      ? 35
      : metric === "dwell"
        ? 55
        : metric === "comments"
          ? 45
          : metric === "uniques"
            ? 50
            : metric === "reach"
              ? 58
              : 42;

  const values = randomWalk(start);
  const points = dateLabels.map((dateLabel, i) => ({ dateLabel, value: values[i] }));

  const toTableValue = () => {
    switch (metric) {
      case "views":
        return faker.number.int({ min: 400_000, max: 3_200_000 });
      case "reach":
        return faker.number.int({ min: 40_000, max: 320_000 });
      case "uniques":
        return faker.number.int({ min: 25_000, max: 260_000 });
      case "dwell":
        return Number(faker.number.float({ min: 20, max: 220 }).toFixed(1));
      case "comments":
        return faker.number.int({ min: 1_000, max: 42_000 });
      case "ctr":
        return Number(faker.number.float({ min: 0.3, max: 4.2 }).toFixed(2));
    }
  };

  const rows: ContentPerformanceRow[] = fullDates
    .slice()
    .reverse()
    .slice(0, Math.min(10, fullDates.length))
    .map((date) => ({ date, value: toTableValue() }));

  const out = { points, rows };
  if (range) faker.seed(20260227);
  return out;
}

export function getContentPerformanceSummary(
  metric: ContentMetricTab,
  range?: DateRangePreset,
): {
  median: number;
  average: number;
  total: number;
} {
  const { rows } = getContentPerformanceMetricData(metric, range);
  const values = rows.map((r) => r.value).slice().sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);
  const median =
    values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
  const total = rows.reduce((acc, r) => acc + r.value, 0);
  const average = total / Math.max(1, rows.length);
  return { median, average, total };
}

/** Table dimension for content performance: which breakdown to show. Figma nodes 12101:353764 (Date), 353581 (Headline), 353491 (Content type), 353338 (Region), 353248 (Device), 353005 (Category). */
export type ContentPerformanceTableDimension =
  | "date"
  | "headline"
  | "content_type"
  | "region"
  | "device"
  | "category";

export interface ContentPerformanceDimensionRow {
  label: string;
  value: number;
}

const HEADLINE_POOL = [
  "A once-in-a-decade bomb cyclone is taking shape off the West Coast",
  "Italian village offers $1 homes to Americans upset by the U.S. election result",
  "'Doomsday fish' returns to Southern California shores for the third time this year",
  "Winter storms forecast to hit much of U.S. as Americans gear up for Thanksgiving travel",
  "Some Arab Americans who voted for Trump are concerned about his picks for key positions",
  "Markets end higher as investors weigh inflation data and earnings outlooks",
  "New study links sleep regularity to improved heart health, researchers say",
  "FAA investigates close call after two planes cleared for same runway",
  "Wildfire containment improves as crews brace for shifting winds this weekend",
  "Streaming platforms raise prices again as ad tiers expand across services",
  "Local officials warn of flooding risk as rivers rise after heavy rain",
  "Tech layoffs slow, but hiring remains cautious heading into spring",
  "Supreme Court to hear case on state social media laws",
  "Electric vehicle sales slow as automakers adjust production",
  "Housing market shows signs of cooling in major metros",
  "Climate summit ends with agreement on renewable energy targets",
  "Medical breakthrough in treatment of rare disease",
  "Olympic committee announces host city for 2032 games",
  "Major retailer reports strong holiday sales despite inflation",
  "Scientists discover new species in deep ocean expedition",
  "Labor union reaches tentative agreement with automakers",
  "Federal reserve holds rates steady amid mixed economic data",
  "Film festival opens with record number of international entries",
  "School district adopts new curriculum for digital literacy",
  "Nonprofit launches initiative to address food insecurity",
];

const CONTENT_TYPES = ["Article", "Video", "Slideshow", "Gallery", "Live"];
const REGIONS = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France"];
const DEVICES = ["Desktop", "Mobile", "Tablet"];
const CATEGORIES = ["News", "Sports", "Finance", "Entertainment", "Life", "Tech"];
const PAGINATED_DIMENSION_ROW_COUNT = 28;

function getMetricValueForDimension(metric: ContentMetricTab): number {
  switch (metric) {
    case "views":
      return faker.number.int({ min: 400_000, max: 3_200_000 });
    case "reach":
      return faker.number.int({ min: 40_000, max: 320_000 });
    case "uniques":
      return faker.number.int({ min: 25_000, max: 260_000 });
    case "dwell":
      return Number(faker.number.float({ min: 20, max: 220 }).toFixed(1));
    case "comments":
      return faker.number.int({ min: 1_000, max: 42_000 });
    case "ctr":
      return Number(faker.number.float({ min: 0.3, max: 4.2 }).toFixed(2));
  }
}

export function getContentPerformanceTableByDimension(
  metric: ContentMetricTab,
  dimension: ContentPerformanceTableDimension,
  range?: DateRangePreset,
): {
  firstColHeader: string;
  secondColHeader: string;
  rows: ContentPerformanceDimensionRow[];
} {
  if (range) {
    const seed = `content-dim-${metric}-${dimension}-${range}`;
    faker.seed(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));
  }
  const secondColHeader =
    metric === "ctr" ? "CTR" : metric.charAt(0).toUpperCase() + metric.slice(1);

  if (dimension === "date") {
    const { rows } = getContentPerformanceMetricData(metric, range);
    const out: ContentPerformanceDimensionRow[] = rows.map((r) => ({
      label: r.date,
      value: r.value,
    }));
    if (range) faker.seed(20260227);
    return { firstColHeader: "Date", secondColHeader, rows: out };
  }

  if (dimension === "headline") {
    const labels = faker.helpers.shuffle([...HEADLINE_POOL]).slice(0, PAGINATED_DIMENSION_ROW_COUNT);
    const rows: ContentPerformanceDimensionRow[] = labels.map((label) => ({
      label,
      value: getMetricValueForDimension(metric),
    }));
    if (range) faker.seed(20260227);
    return { firstColHeader: "Headline", secondColHeader, rows };
  }

  if (dimension === "content_type") {
    const rows: ContentPerformanceDimensionRow[] = CONTENT_TYPES.map((label) => ({
      label,
      value: getMetricValueForDimension(metric),
    }));
    if (range) faker.seed(20260227);
    return { firstColHeader: "Content type", secondColHeader, rows };
  }

  if (dimension === "region") {
    const rows: ContentPerformanceDimensionRow[] = Array.from(
      { length: PAGINATED_DIMENSION_ROW_COUNT },
      (_, i) => ({
        label:
          REGIONS.length > 0 && i >= REGIONS.length
            ? `${REGIONS[i % REGIONS.length]!} (${Math.floor(i / REGIONS.length) + 1})`
            : REGIONS[i % REGIONS.length]!,
        value: getMetricValueForDimension(metric),
      }),
    );
    if (range) faker.seed(20260227);
    return { firstColHeader: "Region", secondColHeader, rows };
  }

  if (dimension === "device") {
    const rows: ContentPerformanceDimensionRow[] = Array.from(
      { length: PAGINATED_DIMENSION_ROW_COUNT },
      (_, i) => ({
        label:
          DEVICES.length > 0 && i >= DEVICES.length
            ? `${DEVICES[i % DEVICES.length]!} (${Math.floor(i / DEVICES.length) + 1})`
            : DEVICES[i % DEVICES.length]!,
        value: getMetricValueForDimension(metric),
      }),
    );
    if (range) faker.seed(20260227);
    return { firstColHeader: "Device", secondColHeader, rows };
  }

  const rows: ContentPerformanceDimensionRow[] = Array.from(
    { length: PAGINATED_DIMENSION_ROW_COUNT },
    (_, i) => ({
      label:
        CATEGORIES.length > 0 && i >= CATEGORIES.length
          ? `${CATEGORIES[i % CATEGORIES.length]!} (${Math.floor(i / CATEGORIES.length) + 1})`
          : CATEGORIES[i % CATEGORIES.length]!,
      value: getMetricValueForDimension(metric),
    }),
  );
  if (range) faker.seed(20260227);
  return { firstColHeader: "Category", secondColHeader, rows };
}

export function getRankedContentRows(range?: DateRangePreset, brandId?: string): RankedContentRow[] {
  const seedKey = `ranked-content-${range ?? "default"}-${brandId ?? ""}`;
  faker.seed(seedKey.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227 + brandSeedOffset(brandId)));
  const headlinePool = [
    "A once-in-a-decade bomb cyclone is taking shape off the West Coast",
    "Italian village offers $1 homes to Americans upset by the U.S. election result",
    "‘Doomsday fish’ returns to Southern California shores for the third time this year",
    "Winter storms forecast to hit much of U.S. as Americans gear up for Thanksgiving travel",
    "Some Arab Americans who voted for Trump are concerned about his picks for key positions",
    "Markets end higher as investors weigh inflation data and earnings outlooks",
    "New study links sleep regularity to improved heart health, researchers say",
    "FAA investigates close call after two planes cleared for same runway",
    "Wildfire containment improves as crews brace for shifting winds this weekend",
    "Streaming platforms raise prices again as ad tiers expand across services",
    "Local officials warn of flooding risk as rivers rise after heavy rain",
    "Tech layoffs slow, but hiring remains cautious heading into spring",
  ];

  const headlines = faker.helpers.shuffle(headlinePool).slice(0, 5);
  const rows = headlines.map((title, idx) => ({
    rank: idx + 1,
    title,
    views: faker.number.int({ min: 120_000, max: 1_600_000 }),
  }));

  const out = rows.sort((a, b) => b.views - a.views).map((row, idx) => ({
    ...row,
    rank: idx + 1,
  }));
  if (range) faker.seed(20260227);
  return out;
}

const TOP_CONTENT_BRANDS = ["Yahoo News", "Yahoo Sports", "Yahoo Finance", "Yahoo Entertainment", "Yahoo Life"];

const TOP_CONTENT_ROW_COUNT = 100;

export function getTopContentRows(range?: DateRangePreset): TopContentRow[] {
  if (range) {
    const seed = `top-content-${range}`;
    faker.seed(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));
  }
  const shuffled = faker.helpers.shuffle([...HEADLINE_POOL]);
  const titles = Array.from({ length: TOP_CONTENT_ROW_COUNT }, (_, i) =>
    i < shuffled.length ? shuffled[i] : faker.lorem.sentence()
  );
  const rows: TopContentRow[] = titles.map((contentTitle, i) => ({
    rank: i + 1,
    contentTitle,
    contentType: faker.helpers.arrayElement(CONTENT_TYPES),
    brand: faker.helpers.arrayElement(TOP_CONTENT_BRANDS),
    views: faker.number.int({ min: 120_000, max: 2_800_000 }),
    visitors: faker.number.int({ min: 80_000, max: 1_200_000 }),
    reach: faker.number.int({ min: 50_000, max: 900_000 }),
    ctr: Number(faker.number.float({ min: 0.5, max: 4.2 }).toFixed(2)),
    dwell: Number(faker.number.float({ min: 25, max: 210 }).toFixed(1)),
    engagements: faker.number.int({ min: 1_000, max: 85_000 }),
  }));
  const sorted = rows.sort((a, b) => b.views - a.views).map((row, idx) => ({ ...row, rank: idx + 1 }));
  if (range) faker.seed(20260227);
  return sorted;
}

export function getBrandComparisonRows(range?: DateRangePreset, brandId?: string): BrandComparisonRow[] {
  const seedKey = `brand-comparison-${range ?? "default"}-${brandId ?? ""}`;
  faker.seed(seedKey.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227 + brandSeedOffset(brandId)));
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"];

  const rows = brands.map((brand, idx) => ({
    rank: idx + 1,
    brand,
    views: faker.number.int({ min: 120_000, max: 2_900_000 }),
    reach: faker.number.int({ min: 20_000, max: 280_000 }),
    ctr: Number(faker.number.float({ min: 0.4, max: 3.2 }).toFixed(1)),
    averageDwell: Number(faker.number.float({ min: 35, max: 190 }).toFixed(1)),
    comments: faker.number.int({ min: 2_000, max: 40_000 }),
    contentCount: faker.number.int({ min: 2_000, max: 40_000 }),
  }));

  const out = rows.sort((a, b) => b.views - a.views).map((row, i) => ({
    ...row,
    rank: i + 1,
  }));
  if (range) faker.seed(20260227);
  return out;
}

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: "Viewer" | "Admin";
  brand: string;
  lastSignIn: string;
  deactivated: boolean;
}

const BRANDS_LIST = ["NBC", "B/R", "TechCrunch", "BI", "T", "CNN", "P", "7", "W"];

let cachedMockUsers: MockUser[] | null = null;

export function getMockUsers(): MockUser[] {
  if (cachedMockUsers) return cachedMockUsers;
  faker.seed(20260227);
  cachedMockUsers = Array.from({ length: 10 }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    return {
      id: `user-${i + 1}`,
      firstName,
      lastName,
      fullName,
      email,
      role: i % 2 === 0 ? "Viewer" : "Admin",
      brand: BRANDS_LIST[i % BRANDS_LIST.length],
      lastSignIn: "Sep 10, 2024 at 8:54 PM ET",
      deactivated: i === 4 || i === 9,
    };
  });
  faker.seed(20260227);
  return cachedMockUsers;
}

export function getMockUserById(id: string): MockUser | undefined {
  return getMockUsers().find((u) => u.id === id);
}

// ─── Feed health detail ───────────────────────────────────────────────────────

/** Per-feed KPIs for the Feed Health Detail page (6 metrics, 2×3 grid). */
export function getFeedDetailKpis(feedId: string, range?: DateRangePreset): PublishingVitalsKpi[] {
  const seedStr = `feed-detail-kpis-${feedId}-${range ?? "default"}`;
  faker.seed(seedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));

  const successRate = faker.number.float({ min: 88, max: 99, fractionDigits: 1 });
  const totalItems = faker.number.int({ min: 800, max: 3500 });
  const published = Math.round(totalItems * (successRate / 100) * 0.88);
  const publishedWithWarnings = Math.round(totalItems * (successRate / 100) * 0.12);
  const failed = Math.max(0, totalItems - published - publishedWithWarnings);
  const uptime = faker.number.float({ min: 97.0, max: 99.9, fractionDigits: 1 });

  const out: PublishingVitalsKpi[] = [
    { id: "success-rate", label: "Content success rate", value: `${successRate.toFixed(1)}%`, delta: "+2.3%", trend: "up", helperText: "Percentage of content items successfully processed and published without errors." },
    { id: "total-items", label: "Total items", value: totalItems.toLocaleString("en-US"), delta: "+8.1%", trend: "up", helperText: "Total content items ingested for this feed in the selected period." },
    { id: "feed-uptime", label: "Feed uptime", value: `${uptime.toFixed(1)}%`, delta: "+0.1%", trend: "up", helperText: "Percentage of time this feed was available and processing successfully." },
    { id: "published", label: "Published", value: published.toLocaleString("en-US"), delta: "-3.2%", trend: "down", helperText: "Content items fully published to Yahoo surfaces." },
    { id: "published-with-warnings", label: "Published with warnings", value: publishedWithWarnings.toLocaleString("en-US"), delta: "+5.1%", trend: "up", helperText: "Items published with one or more non-blocking quality warnings." },
    { id: "failed-to-publish", label: "Failed to publish", value: failed.toLocaleString("en-US"), delta: "-12.5%", trend: "down", helperText: "Items that could not be published due to critical errors." },
  ];

  faker.seed(20260227);
  return out;
}

/** One cell in the Feed reliability heat map (X = date, Y = hour of day). */
export interface HeatMapCell {
  dateIdx: number; // index into dates array
  hour: number;    // 0–23
  status: 0 | 1 | 2; // 0 = ok (not stored), 1 = delayed, 2 = error
}

export interface FeedHeatMapData {
  dates: string[];       // e.g. ["1/14", "1/15", …]
  cells: HeatMapCell[];  // only delayed/error cells; background = ok
}

export function getFeedHeatMapData(feedId: string, range?: DateRangePreset): FeedHeatMapData {
  const seedStr = `feed-heatmap-${feedId}-${range ?? "default"}`;
  faker.seed(seedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));

  const days = range === "last7" ? 7 : range === "last14" ? 14 : range === "last24h" ? 1 : 11;
  const baseDate = new Date(2026, 0, 14); // Jan 14, 2026
  const dates: string[] = Array.from({ length: days }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const cells: HeatMapCell[] = [];
  for (let d = 0; d < days; d++) {
    for (let h = 0; h < 24; h++) {
      const roll = faker.number.int({ min: 0, max: 99 });
      if (roll >= 97) {
        cells.push({ dateIdx: d, hour: h, status: 2 }); // error
      } else if (roll >= 87) {
        cells.push({ dateIdx: d, hour: h, status: 1 }); // delayed
      }
    }
  }

  faker.seed(20260227);
  return { dates, cells };
}

const FEED_ITEM_TITLES = [
  "A once-in-a-decade bomb cyclone is taking shape off the West Coast",
  "Italian village offers $1 homes to Americans upset by the US election result",
  "'Doomsday fish' returns to Southern California shores for the third time this year",
  "Winter storms forecast to hit much of U.S. as Americans gear up for Thanksgiving travel",
  "Scientists discover new deep-sea species off the coast of New Zealand",
  "Tech giant announces major AI partnership with leading research university",
  "Olympic athlete breaks long-standing world record in dramatic fashion",
  "City council votes to overhaul public transit system with electric buses",
  "New study links gut health to improved mental performance",
  "Historic preservation group fights to save 19th century waterfront district",
];

const FEED_ITEM_DESCS = [
  "Scientists are calling it a once-in-a-generation discovery that could reshape our understanding of deep ocean ecosystems and the creatures that inhabit them.",
  "Local officials say the project will modernize aging infrastructure while creating hundreds of construction jobs over the next three years.",
  "The athlete shattered a record that had stood for nearly two decades, completing the course in a time no one thought possible heading into the competition.",
  "Researchers say the findings, published in a peer-reviewed journal, could lead to new treatment options for patients within five to seven years.",
  "The company's announcement sent shares surging in after-hours trading as investors responded positively to the partnership's potential market implications.",
  "Emergency crews worked through the night to restore power to thousands of homes as temperatures dropped well below seasonal averages across the region.",
  "Organizers say attendance broke previous records, drawing visitors from over forty countries to witness the competition's most dramatic finale in recent memory.",
  "The proposal, which faces a vote next month, has drawn both praise from community groups and criticism from business leaders over its long-term economic impact.",
  "Officials confirmed the recall affects units manufactured between January and June and urged consumers to stop using the product immediately pending further review.",
  "The initiative aims to connect underserved communities with high-speed internet access, with rollout expected to begin in rural areas before expanding to urban centers.",
];

export type FeedItemStatus = "Published" | "Published with warning" | "Not published";

export interface FeedRecentItem {
  id: string;
  title: string;
  description: string;
  contentType: FeedContentType;
  status: FeedItemStatus;
  publishedAt: string;
  thumbnailSeed: number;
}

export function getFeedRecentItems(feedId: string, range?: DateRangePreset): FeedRecentItem[] {
  const seedStr = `feed-recent-${feedId}-${range ?? "default"}`;
  faker.seed(seedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));

  const items: FeedRecentItem[] = Array.from({ length: 25 }, () => ({
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement(FEED_ITEM_TITLES),
    description: faker.helpers.arrayElement(FEED_ITEM_DESCS),
    contentType: faker.helpers.arrayElement(["video", "article", "slideshow"] as const),
    status: faker.helpers.arrayElement(["Published", "Published with warning", "Not published"] as const),
    publishedAt: (() => {
      const d = faker.date.recent({ days: 7, refDate: new Date(2026, 0, 20) });
      const mon = d.toLocaleString("en-US", { month: "short" });
      const day = d.getDate();
      const yr = d.getFullYear();
      const h = d.getHours() % 12 || 12;
      const min = String(d.getMinutes()).padStart(2, "0");
      const ampm = d.getHours() >= 12 ? "PM" : "AM";
      return `${mon} ${day}, ${yr} at ${h}:${min} ${ampm} PT`;
    })(),
    thumbnailSeed: faker.number.int({ min: 100, max: 999 }),
  }));

  faker.seed(20260227);
  return items;
}

// ─── Modal data ───────────────────────────────────────────────────────────────

export type ContentPerfTab = "Views" | "Uniques" | "Reach" | "CTR" | "Dwell" | "Comments";

export interface ContentMetadata {
  partnerUrl: string;
  yahooUrl: string;
  sourceFeed: string;
  guid: string;
  documentId: string;
  tabTotals: Record<ContentPerfTab, string>;
  chartDates: string[];
  chartSeries: Record<ContentPerfTab, number[]>;
}

// ─── Issue modal data types ───────────────────────────────────────────────────

export type IssueExcerptType = "text" | "image" | "code";
export type IssueFooterType = "button" | "link" | "none";

export interface IssueModalItem {
  id: string;
  /** Section header label (single) or accordion row label (multiple). */
  title: string;
  description: string;
  /** Full text of the lightbulb action pill. */
  actionText: string;
  /** The substring of actionText that renders as an underlined hyperlink. */
  actionLinkText?: string;
  excerptType: IssueExcerptType;
  /** Raw text/code content. Empty string = no excerpt shown. */
  excerptContent: string;
  /** Label above the excerpt block. Defaults to "Content excerpt". */
  excerptLabel?: string;
  /** Substrings of excerptContent to highlight in the issue accent color. */
  flaggedTerms?: string[];
}

export interface IssueModalData {
  issueType: "warning" | "failed";
  variant: "single" | "multiple";
  /** Title shown in the modal chrome header (e.g. "Restricted word", "Multiple issues"). */
  modalTitle: string;
  issues: IssueModalItem[];
  footerType: IssueFooterType;
}

/** Unified lightweight type for passing content items into modals. */
export interface ContentModalItem {
  id: string;
  title: string;
  description: string;
  snippet: string;
  contentType: FeedContentType;
  thumbnailSeed: number;
  publishedAt: string;
  status?: string;
}

// ─── Issue detail page data ───────────────────────────────────────────────────

const ISSUE_DESCRIPTIONS: Record<string, string> = {
  "High tragedy score": "Content items with a high tragedy score are flagged before publishing because they may conflict with brand-safety guidelines. Review the flagged items and adjust categorisation or metadata to bring the score within acceptable thresholds.",
  "Missing required image field": "One or more required image fields are absent from these content items. Yahoo surfaces require a valid thumbnail image for proper rendering. Add the missing image field to resolve this issue and allow normal publishing.",
  "Invalid canonical URL format": "The canonical URL provided for these items does not conform to the expected format. Malformed canonical URLs can affect SEO indexing and content deduplication. Correct the URL structure to clear this warning.",
  "Stale sitemap detected": "The sitemap associated with this feed has not been updated within the expected refresh window. Stale sitemaps can cause content discovery delays. Trigger a sitemap refresh or check your publishing pipeline for errors.",
  "High 5xx response rate": "The feed endpoint is returning an elevated rate of server-side errors (5xx). This may indicate instability in the source CMS or CDN. Investigate server logs and address the root cause to restore normal ingestion.",
  "Schema validation failed": "Submitted content does not match the required schema definition. Fields may be missing, malformed, or of the wrong type. Review the schema documentation and correct the affected fields in the source feed.",
  "Unexpected drop in items ingested": "The number of items ingested in this feed has fallen significantly below the expected baseline. This may indicate a pipeline failure, a source feed change, or a configuration issue. Investigate the ingestion logs to identify the cause.",
};

const ISSUE_DESCRIPTION_FALLBACK =
  "This issue is affecting content publishing for the selected feed. Review the flagged items and follow the recommended remediation steps to restore normal publishing behaviour.";

const ISSUE_TIPS: Record<string, string> = {
  "High tragedy score":
    "Review the content's sentiment metadata and adjust the categorisation to bring the tragedy score below the allowed threshold. Consult the brand safety guidelines for acceptable ranges.",
  "Missing required image field":
    "Ensure all content items include a valid thumbnail URL in the required image field. The image must be hosted on an approved CDN and return a 200 status code.",
  "Invalid canonical URL format":
    "Verify the canonical URL starts with https:// and follows the pattern expected by the Yahoo ingestion system. Avoid query parameters or fragment identifiers.",
  "Stale sitemap detected":
    "Update your sitemap to include all recent content items. Ensure lastmod timestamps are accurate and the file is reachable at the configured endpoint.",
  "High 5xx response rate":
    "Check your origin server health and CDN configuration. Consider implementing retry logic and response caching to reduce origin load.",
  "Schema validation failed":
    "Validate your feed against the latest schema using the provided validator tool. Pay close attention to required fields and data type constraints.",
  "Unexpected drop in items ingested":
    "Verify your source CMS is correctly exporting items and the feed endpoint returns the expected count. Check for recent configuration changes that may have affected output.",
};

const ISSUE_TIP_FALLBACK =
  "Follow the recommended remediation steps in the Yahoo Publisher documentation to resolve this issue and restore normal publishing behaviour.";

const CONTENT_EXCERPTS: { text: string; highlights: string[] }[] = [
  {
    text: "The content item contains a field value that exceeds the maximum allowed character limit for the required title attribute in this feed configuration.",
    highlights: ["maximum allowed character limit", "required title attribute"],
  },
  {
    text: "An image asset referenced in this content item returned an unexpected status code during the pre-publish validation check performed by the ingestion pipeline.",
    highlights: ["unexpected status code", "pre-publish validation"],
  },
  {
    text: "The canonical URL associated with this article does not conform to the expected domain whitelist configuration for the current publishing surface.",
    highlights: ["canonical URL", "domain whitelist configuration"],
  },
];

const CONTENT_PERF_TABS: ContentPerfTab[] = [
  "Views", "Uniques", "Reach", "CTR", "Dwell", "Comments",
];

export function getContentMetadata(itemId: string): ContentMetadata {
  const seedStr = `content-meta-${itemId}`;
  faker.seed(seedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));

  const slug = faker.string.alphanumeric(8).toLowerCase();
  const partnerUrl = `https://partner-news.com/articles/${slug}`;
  const yahooUrl = `https://news.yahoo.com/story/${slug}-${faker.string.alphanumeric(6).toLowerCase()}`;
  const feedNum = faker.number.int({ min: 1000, max: 9999 });
  const sourceFeed = `Partner Feed ${feedNum}`;
  const guid = faker.string.uuid();
  const documentId = `doc-${faker.string.alphanumeric(7).toLowerCase()}`;

  const baseDate = new Date(2026, 0, 14);
  const chartDates: string[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const tabTotals = {} as Record<ContentPerfTab, string>;
  const chartSeries = {} as Record<ContentPerfTab, number[]>;
  for (const tab of CONTENT_PERF_TABS) {
    const total = faker.number.int({ min: 1500, max: 5000 });
    tabTotals[tab] = total >= 1000 ? `${(total / 1000).toFixed(1)}K` : String(total);
    chartSeries[tab] = Array.from({ length: 7 }, () => faker.number.int({ min: 15, max: 100 }));
  }

  faker.seed(20260227);
  return { partnerUrl, yahooUrl, sourceFeed, guid, documentId, tabTotals, chartDates, chartSeries };
}

/** Deterministic hash used to pick a variant without disturbing the faker seed. */
function _quickHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ─── Static variant content (matches Figma node specs) ───────────────────────

const _WARN_CODE_EXCERPT =
  `<p>As data journalism evolves, interactive visualizations are becoming an essential tool for telling complex stories. The following visualization demonstrates the correlation between education funding and graduation rates across different states.</p> ` +
  `<div class='tableauPlaceholder'> <object class='tableauViz'> <param name='host_url' value='https://public.tableau.com/' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /> <param name='name' value='DataVisualizationExample/Dashboard1' /> <param name='tabs' value='no' /> <param name='toolbar' value='yes' /> </object> </div>` +
  ` <p>The visualization above shows a clear trend: states that invest more in education per student tend to have higher graduation rates, though there are notable exceptions worth exploring.</p>`;

const _WARN_TEXT_EXCERPT =
  "As the weekend approaches, sports fans are eagerly awaiting the upcoming matchups. Our experts have analyzed the latest trends and statistics to provide you with insights into the games. The Giants are favored to win against the Eagles, with betting odds currently at -135. Most sportsbooks are predicting a close game, but the Giants' strong home record gives them an edge. In basketball, the Lakers vs. Warriors matchup has garnered significant attention with the spread set at just 2.5 points. The over/under for total points is 228.5.";

const _FAIL_CODE_EXCERPT =
  `<item> <title>10 Best Places to Visit in Europe This Summer</title> <link>https://example.com/europe-travel-2025</link> <description>Discover the most beautiful destinations...</description>` +
  `<pubDate>Wed, 14 May 2025 09:00:00 GMT</pubDate>` +
  `<guid>travel-europe-2025-001</guid> <enclosure url="https://example.com/images/europe.jpg" length="0" type="image/jpeg"/> </item>`;

export function getContentIssueWarning(itemId: string): IssueModalData {
  const variant = _quickHash(itemId) % 4;

  // Variant 0 — "Unsupported embed removed": single, code excerpt, button footer
  if (variant === 0) {
    return {
      issueType: "warning",
      variant: "single",
      modalTitle: "Unsupported embed removed",
      issues: [{
        id: `${itemId}-warn-0`,
        title: "Warning",
        description:
          `Our system detected and removed an unsupported HTML tag from this content so that it displays correctly and safely. As a result, the text or code that was inside this tag may appear as unformatted plain text or cause other display issues.`,
        actionText:
          "Remove the unsupported tag from your feed. Review our technical guidelines for a list of supported HTML tags.",
        actionLinkText: "technical guidelines",
        excerptType: "code",
        excerptContent: _WARN_CODE_EXCERPT,
        excerptLabel: "Content excerpt",
        flaggedTerms: [
          "<div class='tableauPlaceholder'> <object class='tableauViz'> <param name='host_url' value='https://public.tableau.com/' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /> <param name='name' value='DataVisualizationExample/Dashboard1' /> <param name='tabs' value='no' /> <param name='toolbar' value='yes' /> </object> </div>",
        ],
      }],
      footerType: "button",
    };
  }

  // Variant 1 — "Low image quality": single, image placeholder, button footer
  if (variant === 1) {
    return {
      issueType: "warning",
      variant: "single",
      modalTitle: "Low image quality",
      issues: [{
        id: `${itemId}-warn-1`,
        title: "Warning",
        description:
          "This video appears to have low technical quality, such as low bitrate or resolution. The content was published, but its distribution may be limited.",
        actionText:
          "Review our video specifications and make sure your content meets our guidelines for bitrate and resolution.",
        actionLinkText: "video specifications",
        excerptType: "image",
        excerptContent: "",
        excerptLabel: "Content excerpt",
      }],
      footerType: "button",
    };
  }

  // Variant 2 — "Restricted word": single, text excerpt with flagged term, link footer
  if (variant === 2) {
    return {
      issueType: "warning",
      variant: "single",
      modalTitle: "Restricted word",
      issues: [{
        id: `${itemId}-warn-2`,
        title: "Warning",
        description:
          `Our system detected a restricted word in this item. The content was published, but the presence of this word may limit its distribution.`,
        actionText:
          "Review this content and remove the restricted word to get the widest possible distribution. If you believe the system made a mistake, please contact our support team.",
        excerptType: "text",
        excerptContent: _WARN_TEXT_EXCERPT,
        excerptLabel: "Content excerpt",
        flaggedTerms: ["betting"],
      }],
      footerType: "link",
    };
  }

  // Variant 3 — "Multiple issues": two accordion rows, button footer per expanded item
  return {
    issueType: "warning",
    variant: "multiple",
    modalTitle: "Multiple issues",
    issues: [
      {
        id: `${itemId}-warn-m0`,
        title: "Content warning: Unsupported content removed",
        description:
          `Our system detected and removed an unsupported HTML tag from this content so that it displays correctly and safely. As a result, the text or code that was inside this tag may appear as unformatted plain text or cause other display issues.`,
        actionText:
          "Remove the unsupported tag from your feed. Review our technical guidelines for a list of supported HTML tags.",
        actionLinkText: "technical guidelines",
        excerptType: "code",
        excerptContent: _WARN_CODE_EXCERPT,
        excerptLabel: "Content excerpt",
        flaggedTerms: [
          "<div class='tableauPlaceholder'> <object class='tableauViz'> <param name='host_url' value='https://public.tableau.com/' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /> <param name='name' value='DataVisualizationExample/Dashboard1' /> <param name='tabs' value='no' /> <param name='toolbar' value='yes' /> </object> </div>",
        ],
      },
      {
        id: `${itemId}-warn-m1`,
        title: "Content warning: Restricted word",
        description:
          `Our system detected a restricted word in this item. The content was published, but the presence of this word may limit its distribution.`,
        actionText:
          "Review this content and remove the restricted word to get the widest possible distribution. If you believe the system made a mistake, please contact our support team.",
        excerptType: "text",
        excerptContent: _WARN_TEXT_EXCERPT,
        excerptLabel: "Content excerpt",
        flaggedTerms: ["betting"],
      },
    ],
    footerType: "button",
  };
}

export function getContentIssueFailure(itemId: string): IssueModalData {
  const variant = _quickHash(`fail-${itemId}`) % 3;

  // Variant 0 — "Missing required field": single, code excerpt, button footer
  if (variant === 0) {
    return {
      issueType: "failed",
      variant: "single",
      modalTitle: "Missing required field",
      issues: [{
        id: `${itemId}-fail-0`,
        title: "Failed to publish",
        description:
          `This item wasn't processed because it's missing a required field. As a result, this item was rejected and the content wasn't published.`,
        actionText:
          "Add the required field to the item. Review our technical guidelines for a list of required fields.",
        actionLinkText: "technical guidelines",
        excerptType: "code",
        excerptContent: _FAIL_CODE_EXCERPT,
        excerptLabel: "Required schema format",
        flaggedTerms: ["<pubDate>Wed, 14 May 2025 09:00:00 GMT</pubDate>"],
      }],
      footerType: "button",
    };
  }

  // Variant 1 — "Content wasn't assembled": single, no excerpt, link footer
  if (variant === 1) {
    return {
      issueType: "failed",
      variant: "single",
      modalTitle: "Content wasn't assembled",
      issues: [{
        id: `${itemId}-fail-1`,
        title: "Failed to publish",
        description:
          "This item couldn't be assembled because of an internal system error. As a result, this item was rejected and the content wasn't published.",
        actionText:
          "No immediate action is needed from you. This indicates a problem with our internal content assembly service that our teams have been alerted to. Our system will automatically retry the process. If you continue to see this error, contact support.",
        excerptType: "text",
        excerptContent: "",
        excerptLabel: "",
      }],
      footerType: "link",
    };
  }

  // Variant 2 — "Multiple issues": two accordion rows in red
  return {
    issueType: "failed",
    variant: "multiple",
    modalTitle: "Multiple issues",
    issues: [
      {
        id: `${itemId}-fail-m0`,
        title: "Missing required field",
        description:
          `This item wasn't processed because it's missing a required field. As a result, this item was rejected and the content wasn't published.`,
        actionText:
          "Add the required field to the item. Review our technical guidelines for a list of required fields.",
        actionLinkText: "technical guidelines",
        excerptType: "code",
        excerptContent: _FAIL_CODE_EXCERPT,
        excerptLabel: "Required schema format",
        flaggedTerms: ["<pubDate>Wed, 14 May 2025 09:00:00 GMT</pubDate>"],
      },
      {
        id: `${itemId}-fail-m1`,
        title: "Content wasn't assembled",
        description:
          "This item couldn't be assembled because of an internal system error. As a result, this item was rejected and the content wasn't published.",
        actionText:
          "No immediate action is needed from you. This indicates a problem with our internal content assembly service that our teams have been alerted to. Our system will automatically retry the process. If you continue to see this error, contact support.",
        excerptType: "text",
        excerptContent: "",
        excerptLabel: "",
      },
    ],
    footerType: "button",
  };
}

/** Generate a deterministic sample content item for issue-level modals (no specific article context). */
export function getSampleContentItem(seed: string): ContentModalItem {
  const seedStr = `sample-content-${seed}`;
  faker.seed(seedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));

  const d = faker.date.recent({ days: 7, refDate: new Date(2026, 0, 20) });
  const mon = d.toLocaleString("en-US", { month: "short" });
  const h = d.getHours() % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, "0");
  const ampm = d.getHours() >= 12 ? "PM" : "AM";

  const description = faker.helpers.arrayElement(FEED_ITEM_DESCS);
  const item: ContentModalItem = {
    id: `sample-${seed}`,
    title: faker.helpers.arrayElement(FEED_ITEM_TITLES),
    description,
    snippet: description,
    contentType: faker.helpers.arrayElement(["video", "article", "slideshow"] as const),
    thumbnailSeed: faker.number.int({ min: 100, max: 999 }),
    publishedAt: `${mon} ${d.getDate()}, ${d.getFullYear()} at ${h}:${min} ${ampm} PT`,
  };

  faker.seed(20260227);
  return item;
}

export interface IssueDetailData {
  id: string;
  name: string;
  type: "published_with_warning" | "not_published";
  description: string;
  contentVolume: number;
  lastDiscovered: string;
  /** X-axis date/hour labels; length matches trendBars. */
  trendDates: string[];
  /** Data points (0-100) for the Issue trend bar chart. */
  trendBars: number[];
}

export function getIssueDetailData(
  id: string,
  type: "published_with_warning" | "not_published",
  range?: DateRangePreset,
): IssueDetailData {
  // Stable fields — seeded by id only so they don't change when range changes
  const seedStr = `issue-detail-${id}`;
  faker.seed(seedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));

  const name = faker.helpers.arrayElement(ISSUE_POOL);
  const contentVolume = faker.number.int({ min: 500, max: 5500 });
  const ldDate = faker.date.recent({ days: 30, refDate: new Date(2026, 0, 20) });
  const lastDiscovered = `${ldDate.getMonth() + 1}/${ldDate.getDate()}/${ldDate.getFullYear()}`;

  // Range-dependent trend data — re-seed so bars change when range changes
  const trendSeedStr = `issue-trend-${id}-${range ?? "default"}`;
  faker.seed(trendSeedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));

  const { count, hourLabels } = getChartConfig(range);
  const baseDate = new Date(2026, 0, 14); // Jan 14, 2026
  const trendDates: string[] = Array.from({ length: count }, (_, i) => {
    if (hourLabels) return HOUR_LABELS_24[i] ?? `${i}h`;
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    return formatMMDD(d);
  });
  const trendBars = Array.from({ length: count }, () =>
    faker.number.int({ min: 35, max: 100 }),
  );

  faker.seed(20260227);
  return {
    id,
    name,
    type,
    description: ISSUE_DESCRIPTIONS[name] ?? ISSUE_DESCRIPTION_FALLBACK,
    contentVolume,
    lastDiscovered,
    trendDates,
    trendBars,
  };
}

export interface IssueContentItem {
  id: string;
  title: string;
  description: string;
  contentType: FeedContentType;
  thumbnailSeed: number;
  publishedAt: string;
}

export function getIssueContentItems(
  id: string,
  range?: DateRangePreset,
): IssueContentItem[] {
  const seedStr = `issue-content-${id}-${range ?? "default"}`;
  faker.seed(seedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));

  const items: IssueContentItem[] = Array.from({ length: 25 }, () => {
    const d = faker.date.recent({ days: 7, refDate: new Date(2026, 0, 20) });
    const mon = d.toLocaleString("en-US", { month: "short" });
    const h = d.getHours() % 12 || 12;
    const min = String(d.getMinutes()).padStart(2, "0");
    const ampm = d.getHours() >= 12 ? "PM" : "AM";
    return {
      id: faker.string.uuid(),
      title: faker.helpers.arrayElement(FEED_ITEM_TITLES),
      description: faker.helpers.arrayElement(FEED_ITEM_DESCS),
      contentType: faker.helpers.arrayElement(["video", "article", "slideshow"] as const),
      thumbnailSeed: faker.number.int({ min: 100, max: 999 }),
      publishedAt: `${mon} ${d.getDate()}, ${d.getFullYear()} at ${h}:${min} ${ampm} PT`,
    };
  });

  faker.seed(20260227);
  return items;
}

// ─── Global search ────────────────────────────────────────────────────────────

const SEARCH_PROVIDERS = [
  "Yahoo News", "Yahoo Sports", "Yahoo Finance", "Yahoo Entertainment", "Yahoo Life",
  "BuzzFeed", "AccuWeather", "RealSimple", "National Geographic", "ABC News",
];

export interface SearchableContentItem {
  id: string;
  title: string;
  description: string;
  contentType: FeedContentType;
  thumbnailSeed: number;
  publishedAt: string;
  status: FeedItemStatus;
  provider: string;
}

/** Deterministic corpus of publisher content used to power the global search dropdown. */
export function getSearchableContentItems(): SearchableContentItem[] {
  const seedStr = "global-search-index";
  faker.seed(seedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 20260227));

  const items: SearchableContentItem[] = Array.from({ length: 40 }, () => {
    const d = faker.date.recent({ days: 14, refDate: new Date(2026, 0, 20) });
    const mon = d.toLocaleString("en-US", { month: "short" });
    const h = d.getHours() % 12 || 12;
    const min = String(d.getMinutes()).padStart(2, "0");
    const ampm = d.getHours() >= 12 ? "PM" : "AM";
    return {
      id: faker.string.uuid(),
      title: faker.helpers.arrayElement(FEED_ITEM_TITLES),
      description: faker.helpers.arrayElement(FEED_ITEM_DESCS),
      contentType: faker.helpers.arrayElement(["video", "article", "slideshow"] as const),
      thumbnailSeed: faker.number.int({ min: 100, max: 999 }),
      publishedAt: `${mon} ${d.getDate()}, ${d.getFullYear()} at ${h}:${min} ${ampm} PT`,
      status: faker.helpers.arrayElement(["Published", "Published with warning", "Not published"] as const),
      provider: faker.helpers.arrayElement(SEARCH_PROVIDERS),
    };
  });

  faker.seed(20260227);
  return items;
}

/** Most recently published items, shown when the search field is opened with no query. */
export function getRecentlyPublishedItems(limit = 8): SearchableContentItem[] {
  return getSearchableContentItems().slice(0, limit);
}

/** Matches by title, content type, provider, or id (UUID/GUID) — per the partner search spec. */
export function searchContentItems(query: string, limit = 8): SearchableContentItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return getRecentlyPublishedItems(limit);
  return getSearchableContentItems()
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.contentType.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q),
    )
    .slice(0, limit);
}
