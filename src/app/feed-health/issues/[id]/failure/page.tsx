"use client";

import { use } from "react";
import { IssueDetailPage } from "@/components/IssueDetailPage";

export default function IssueFailurePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <IssueDetailPage issueId={id} type="failure" />;
}
