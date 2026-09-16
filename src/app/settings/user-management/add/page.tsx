"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FormErrorBanner, RadioGroup, TextField } from "@/components/user-management/FormFields";
import { ToolAccessCard, toolAccessFieldId } from "@/components/user-management/ToolAccessCard";
import { useUsers } from "@/contexts/UsersContext";
import {
  EMPTY_TOOL_ACCESS,
  getToolAccessErrors,
  isToolAccessValid,
  type EmployeeStatus,
  type ToolAccessState,
} from "@/lib/toolAccess";

const YPP_TOOL_ID = "ypp";

export default function AddUserPage() {
  const router = useRouter();
  const { inviteUser } = useUsers();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState<EmployeeStatus | null>(null);
  const [access, setAccess] = useState<ToolAccessState>(EMPTY_TOOL_ACCESS);
  const [showAccessErrors, setShowAccessErrors] = useState(false);
  const [statusHint, setStatusHint] = useState(false);

  const accessErrors = getToolAccessErrors(access);
  const detailsComplete =
    email.trim().includes("@") && firstName.trim() !== "" && lastName.trim() !== "" && employeeStatus !== null;
  const canSend = detailsComplete && isToolAccessValid(access);

  function handleSend() {
    if (!canSend || !employeeStatus) return;
    inviteUser({ email, firstName, lastName, employeeStatus, access });
    router.push("/settings/user-management");
  }

  return (
    <div className="-mb-10 flex flex-1 flex-col">
      <PageHeader
        breadcrumbs={[{ label: "Users", href: "/settings/user-management" }, { label: "Add user" }]}
        title="Add user"
      />

      <div className="flex w-full max-w-[640px] flex-col gap-8 pb-10 pt-2">
        {showAccessErrors && (
          <FormErrorBanner
            items={accessErrors.map((e) => ({
              id: e.field,
              label: e.message,
              targetId: toolAccessFieldId(YPP_TOOL_ID, e.field),
            }))}
          />
        )}

        <div className="flex flex-col gap-6">
          <TextField
            id="add-user-email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={setEmail}
            placeholder="name@partner.com"
            autoComplete="off"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextField
              id="add-user-first-name"
              label="First name"
              required
              value={firstName}
              onChange={setFirstName}
              autoComplete="off"
            />
            <TextField
              id="add-user-last-name"
              label="Last name"
              required
              value={lastName}
              onChange={setLastName}
              autoComplete="off"
            />
          </div>
          <RadioGroup<EmployeeStatus>
            id="employee-status"
            label="Employee status"
            required
            name="employee-status"
            value={employeeStatus}
            onChange={(v) => {
              setEmployeeStatus(v);
              setStatusHint(false);
            }}
            options={[
              { value: "employee", label: "Employee (full-time or contract)" },
              { value: "non-employee", label: "Non-employee (external partner or freelancer)" },
            ]}
            error={statusHint ? "Select an employee status to assign tool access" : undefined}
          />
        </div>

        <section className="flex flex-col gap-2.5">
          <h2 className="py-2 font-yahoo-product-sans text-[18px] font-bold leading-6 text-[#232a31]">
            Tool access
          </h2>
          <ToolAccessCard
            toolId={YPP_TOOL_ID}
            toolName="Yahoo Partner Portal"
            value={access}
            onChange={setAccess}
            disabled={employeeStatus === null}
            onDisabledAttempt={() => {
              setStatusHint(true);
              document.getElementById("employee-status-first")?.focus();
            }}
            showErrors={showAccessErrors}
            onBlockedCollapse={() => setShowAccessErrors(true)}
          />
        </section>
      </div>

      <div className="sticky bottom-0 z-10 -mx-8 mt-auto border-t border-[#e0e4e9] bg-white px-8">
        <div className="flex w-full max-w-[640px] items-center justify-end gap-3 py-5">
          <button
            type="button"
            onClick={() => router.push("/settings/user-management")}
            className="h-9 rounded-full border border-[#e0e4e9] bg-white px-5 font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31] hover:bg-[#f5f8fa]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            aria-disabled={!canSend}
            className={`h-9 rounded-full px-5 font-yahoo-product-sans text-[14px] font-medium leading-5 text-white transition-colors ${
              canSend ? "bg-[#5D5EFF] hover:bg-[#4A4BE8]" : "cursor-not-allowed bg-[#e0e4e9]"
            }`}
          >
            Send invite
          </button>
        </div>
      </div>
    </div>
  );
}
