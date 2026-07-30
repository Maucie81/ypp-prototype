import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getIssueById } from "@/lib/mockData";

interface IssueDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function IssueDetailPage({ params }: IssueDetailPageProps) {
  const { id } = await params;
  const issue = getIssueById(id);

  if (!issue) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        breadcrumbs={[
          { label: "Issues", href: "/issues" },
          { label: issue.title },
        ]}
        title={issue.title}
        description={`${issue.feedName} · ${issue.code}`}
      />

      <section className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
        <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Technical details
          </h3>
          <p className="whitespace-pre-line text-sm text-slate-700">
            {issue.technicalDetails}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Summary
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Feed</dt>
                <dd className="text-right font-medium text-slate-900">
                  {issue.feedName}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Severity</dt>
                <dd className="text-right font-medium capitalize text-slate-900">
                  {issue.severity}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Affected items</dt>
                <dd className="text-right font-medium text-slate-900">
                  {issue.affectedItems.toLocaleString("en-US")}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">First seen</dt>
                <dd className="text-right text-slate-900">
                  {new Date(issue.firstSeenAt).toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Last seen</dt>
                <dd className="text-right text-slate-900">
                  {new Date(issue.lastSeenAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Recommended actions
            </h3>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
              {issue.recommendedActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

