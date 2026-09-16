export type SelectOption = { id: string; label: string; description?: string };

export type EmployeeStatus = "employee" | "non-employee";

export type ToolAccessState = {
  team: { enabled: boolean; roleId: string | null; teamIds: string[] };
  operational: { enabled: boolean; roleId: string | null };
  brand: { enabled: boolean; brandIds: string[] };
};

export type ToolAccessField = "teamRole" | "teams" | "operationalRole" | "brands";

export type ToolAccessError = { field: ToolAccessField; message: string };

export const EMPTY_TOOL_ACCESS: ToolAccessState = {
  team: { enabled: false, roleId: null, teamIds: [] },
  operational: { enabled: false, roleId: null },
  brand: { enabled: false, brandIds: [] },
};

export const EDITORIAL_ROLES: SelectOption[] = [
  { id: "guest", label: "Guest role", description: "Role description" },
  { id: "contributor", label: "Contributor", description: "Role description" },
  { id: "senior-editor", label: "Senior editor", description: "Role description" },
  { id: "managing-editor", label: "Managing editor", description: "Role description" },
];

export const OPERATIONAL_ROLES: SelectOption[] = [
  { id: "admin", label: "Admin", description: "Role description" },
  { id: "editor", label: "Editor", description: "Role description" },
  { id: "viewer", label: "Viewer", description: "Role description" },
];

export const TEAMS: SelectOption[] = [
  { id: "aol-ca", label: "AOL CA" },
  { id: "aol-uk", label: "AOL UK" },
  { id: "aol-us", label: "AOL US" },
  { id: "yahoo-news", label: "Yahoo News" },
  { id: "yahoo-sports", label: "Yahoo Sports" },
  { id: "yahoo-finance", label: "Yahoo Finance" },
];

export const ACCESS_BRANDS: SelectOption[] = [
  { id: "datapulse-main", label: "Datapulse Media" },
  { id: "datapulse-sports", label: "Datapulse Sports" },
  { id: "datapulse-tech", label: "Datapulse Tech" },
  { id: "datapulse-news", label: "Datapulse News" },
  { id: "datapulse-finance", label: "Datapulse Finance" },
  { id: "datapulse-lifestyle", label: "Datapulse Lifestyle" },
];

export function hasAnyAccess(a: ToolAccessState): boolean {
  return a.team.enabled || a.operational.enabled || a.brand.enabled;
}

export function getToolAccessErrors(a: ToolAccessState): ToolAccessError[] {
  const errors: ToolAccessError[] = [];
  if (a.team.enabled) {
    if (!a.team.roleId) errors.push({ field: "teamRole", message: "Select editorial role" });
    if (a.team.teamIds.length === 0) errors.push({ field: "teams", message: "Select teams" });
  }
  if (a.operational.enabled && !a.operational.roleId) {
    errors.push({ field: "operationalRole", message: "Select a role" });
  }
  if (a.brand.enabled && a.brand.brandIds.length === 0) {
    errors.push({ field: "brands", message: "Select brands" });
  }
  return errors;
}

export function isToolAccessValid(a: ToolAccessState): boolean {
  return hasAnyAccess(a) && getToolAccessErrors(a).length === 0;
}

export function accessBadges(a: ToolAccessState): string[] {
  const out: string[] = [];
  if (a.team.enabled) out.push("Team");
  if (a.operational.enabled) out.push("Operational");
  if (a.brand.enabled) out.push("Brand");
  return out;
}

export function labelFor(options: SelectOption[], id: string | null): string | null {
  if (!id) return null;
  return options.find((o) => o.id === id)?.label ?? null;
}
