import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getIssues } from "@/lib/mockData";

export default function IssuesPage() {
  const issues = getIssues();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Feed issues and errors"
        description="List of active feed issues with severity, impact, and quick links to details."
      />

      <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2 text-xs text-slate-500">
          <span>{issues.length} issues detected</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-4">Issue</th>
                <th className="py-2 pr-4">Feed</th>
                <th className="py-2 pr-4">Severity</th>
                <th className="py-2 pr-4 text-right">Affected items</th>
                <th className="py-2 text-right">Last seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td className="py-2 pr-4 text-slate-900">
                    <Link
                      href={`/issues/${issue.id}`}
                      className="text-slate-900 underline-offset-2 hover:underline"
                    >
                      {issue.title}
                    </Link>
                    <div className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400">
                      {issue.code}
                    </div>
                  </td>
                  <td className="py-2 pr-4 text-slate-600">{issue.feedName}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        issue.severity === "low"
                          ? "bg-slate-50 text-slate-600"
                          : issue.severity === "medium"
                            ? "bg-amber-50 text-amber-700"
                            : issue.severity === "high"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span className="capitalize">{issue.severity}</span>
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-900">
                    {issue.affectedItems.toLocaleString("en-US")}
                  </td>
                  <td className="py-2 text-right text-slate-500">
                    {new Date(issue.lastSeenAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

