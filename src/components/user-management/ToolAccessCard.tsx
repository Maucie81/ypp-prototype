"use client";

import { Icon } from "@yahoo/uds";
import { Add, ChevronDown, ChevronUp, Trash } from "@yahoo/uds-icons";
import { useCallback, useRef, useState } from "react";
import { useOnClickOutside } from "@/lib/useOnClickOutside";
import {
  ACCESS_BRANDS,
  EDITORIAL_ROLES,
  EMPTY_TOOL_ACCESS,
  OPERATIONAL_ROLES,
  TEAMS,
  accessBadges,
  getToolAccessErrors,
  hasAnyAccess,
  type ToolAccessField,
  type ToolAccessState,
} from "@/lib/toolAccess";
import { Checkbox, MultiSelectField, SelectField } from "./FormFields";

export function toolAccessFieldId(toolId: string, field: ToolAccessField) {
  return `${toolId}-${field}`;
}

function RoleDetailsLink() {
  return (
    <button type="button" className="underline hover:no-underline">
      role details
    </button>
  );
}

export function ToolAccessCard({
  toolId,
  toolName,
  value,
  onChange,
  disabled = false,
  onDisabledAttempt,
  showErrors,
  onBlockedCollapse,
  onRemove,
  defaultExpanded = false,
}: {
  toolId: string;
  toolName: string;
  value: ToolAccessState;
  onChange: (next: ToolAccessState) => void;
  /** Employee status not answered yet — the Assign access CTA is inert. */
  disabled?: boolean;
  /** Fired when the user clicks the card while it is disabled, so the parent can explain why. */
  onDisabledAttempt?: () => void;
  /** Parent decides when validation errors are surfaced. */
  showErrors: boolean;
  /** Fired when the user tries to leave/collapse the card with incomplete required fields. */
  onBlockedCollapse?: () => void;
  /** Edit mode: trash icon that clears all access for this tool. */
  onRemove?: () => void;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const anyAccess = hasAnyAccess(value);
  const errors = getToolAccessErrors(value);
  const invalid = errors.length > 0;
  const errorFor = (field: ToolAccessField) =>
    showErrors ? errors.find((e) => e.field === field)?.message : undefined;

  const leave = useCallback(() => {
    if (!anyAccess) {
      setExpanded(false);
      setFocused(false);
      return;
    }
    if (invalid) {
      onBlockedCollapse?.();
      setFocused(false);
      return;
    }
    setFocused(false);
  }, [anyAccess, invalid, onBlockedCollapse]);

  useOnClickOutside(rootRef, leave, expanded);

  function open() {
    if (disabled) {
      onDisabledAttempt?.();
      return;
    }
    setExpanded(true);
    setFocused(true);
  }

  function attemptCollapse() {
    if (anyAccess && invalid) {
      onBlockedCollapse?.();
      setFocused(true);
      return;
    }
    setExpanded(false);
    setFocused(false);
  }

  const badges = accessBadges(value);
  const borderClass = expanded && focused
    ? "border-[#464e56] shadow-[inset_0_0_0_1px_#464e56]"
    : "border-[#e0e4e9]";

  const chevronBtn = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (expanded) attemptCollapse();
        else open();
      }}
      aria-disabled={disabled || undefined}
      aria-expanded={expanded}
      aria-label={expanded ? `Collapse ${toolName}` : `Expand ${toolName}`}
      className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${
        expanded || anyAccess ? "text-[#232a31] hover:bg-[#f0f3f5]" : "text-[#232a31] opacity-20"
      } ${disabled ? "cursor-not-allowed" : ""}`}
    >
      <Icon name={expanded ? ChevronUp : ChevronDown} size="sm" variant="outline" className="size-4" />
    </button>
  );

  return (
    <div
      ref={rootRef}
      onMouseDown={() => {
        if (expanded) setFocused(true);
      }}
      className={`w-full rounded-[8px] border bg-white transition-[border-color,box-shadow] ${borderClass}`}
    >
      {/* Header */}
      <div
        className={`flex h-[68px] items-center justify-between gap-3 py-2 pl-3 pr-4 ${
          !expanded && !disabled ? "cursor-pointer" : ""
        }`}
        onClick={() => {
          if (!expanded) open();
        }}
      >
        <div className="flex min-w-0 items-center gap-1">
          {chevronBtn}
          <span className="truncate font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">
            {toolName}
          </span>
        </div>

        {expanded ? (
          onRemove ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
                setExpanded(false);
                setFocused(false);
              }}
              aria-label={`Remove all ${toolName} access`}
              className="flex size-9 items-center justify-center rounded-full text-[#232a31] hover:bg-[#f0f3f5]"
            >
              <Icon name={Trash} size="sm" variant="outline" className="size-4" />
            </button>
          ) : null
        ) : anyAccess ? (
          <div className="flex shrink-0 items-center gap-1.5">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-[4px] bg-[#e0e4e9] px-2 py-0.5 font-yahoo-product-sans text-[12px] font-medium leading-4 text-[#232a31]"
              >
                {b}
              </span>
            ))}
          </div>
        ) : (
          <button
            type="button"
            aria-disabled={disabled || undefined}
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-2 font-yahoo-product-sans text-[14px] font-medium leading-5 transition-colors ${
              disabled
                ? "cursor-not-allowed text-[#bac1c9]"
                : "text-[#232a31] hover:text-[#5D5EFF]"
            }`}
          >
            <Icon name={Add} size="sm" variant="outline" className="size-4" />
            Assign access
          </button>
        )}
      </div>

      {/* Body */}
      {expanded && (
        <div className="flex flex-col gap-6 px-14 pb-8 pt-2">
          <p className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31]">
            Select one or more access types.
          </p>

          {/* Team access */}
          <div className="flex flex-col gap-4">
            <Checkbox
              id={`${toolId}-team`}
              checked={value.team.enabled}
              onChange={(next) =>
                onChange({
                  ...value,
                  team: next ? { ...value.team, enabled: true } : { ...EMPTY_TOOL_ACCESS.team },
                })
              }
              label="Team access"
              description={
                <>
                  Assign an editorial role and teams that the role extends to. See <RoleDetailsLink />.
                </>
              }
            />
            {value.team.enabled && (
              <div className="flex max-w-[480px] flex-col gap-6 pl-6">
                <SelectField
                  id={toolAccessFieldId(toolId, "teamRole")}
                  label="Editorial role"
                  required
                  placeholder="Select a role"
                  value={value.team.roleId}
                  options={EDITORIAL_ROLES}
                  onChange={(roleId) => onChange({ ...value, team: { ...value.team, roleId } })}
                  error={errorFor("teamRole")}
                />
                <MultiSelectField
                  id={toolAccessFieldId(toolId, "teams")}
                  label="Teams"
                  required
                  placeholder="Type to search and select teams"
                  values={value.team.teamIds}
                  options={TEAMS}
                  onChange={(teamIds) => onChange({ ...value, team: { ...value.team, teamIds } })}
                  error={errorFor("teams")}
                />
              </div>
            )}
          </div>

          {/* Operational access */}
          <div className="flex flex-col gap-4">
            <Checkbox
              id={`${toolId}-operational`}
              checked={value.operational.enabled}
              onChange={(next) =>
                onChange({
                  ...value,
                  operational: next
                    ? { ...value.operational, enabled: true }
                    : { ...EMPTY_TOOL_ACCESS.operational },
                })
              }
              label="Operational access"
              description={<>Assign access across {toolName}. Use sparingly.</>}
            />
            {value.operational.enabled && (
              <div className="flex max-w-[480px] flex-col gap-6 pl-6">
                <SelectField
                  id={toolAccessFieldId(toolId, "operationalRole")}
                  label="Role"
                  required
                  placeholder="Select a role"
                  value={value.operational.roleId}
                  options={OPERATIONAL_ROLES}
                  onChange={(roleId) => onChange({ ...value, operational: { ...value.operational, roleId } })}
                  error={errorFor("operationalRole")}
                />
              </div>
            )}
          </div>

          {/* Brand access */}
          <div className="flex flex-col gap-4">
            <Checkbox
              id={`${toolId}-brand`}
              checked={value.brand.enabled}
              onChange={(next) =>
                onChange({
                  ...value,
                  brand: next ? { ...value.brand, enabled: true } : { ...EMPTY_TOOL_ACCESS.brand },
                })
              }
              label="Brand access"
              description={
                <>
                  Assign brands that the role extends to. See <RoleDetailsLink />.
                </>
              }
            />
            {value.brand.enabled && (
              <div className="flex max-w-[480px] flex-col gap-6 pl-6">
                <MultiSelectField
                  id={toolAccessFieldId(toolId, "brands")}
                  label="Brands"
                  required
                  placeholder="Type to search and select brands"
                  values={value.brand.brandIds}
                  options={ACCESS_BRANDS}
                  onChange={(brandIds) => onChange({ ...value, brand: { ...value.brand, brandIds } })}
                  error={errorFor("brands")}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
