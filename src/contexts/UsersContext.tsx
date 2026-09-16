"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { getMockUsers, type MockUser } from "@/lib/mockData";
import {
  ACCESS_BRANDS,
  EMPTY_TOOL_ACCESS,
  type EmployeeStatus,
  type ToolAccessState,
} from "@/lib/toolAccess";

export type PortalUser = MockUser & {
  employeeStatus: EmployeeStatus;
  access: ToolAccessState;
  inviteSent: boolean;
};

export type InviteInput = {
  email: string;
  firstName: string;
  lastName: string;
  employeeStatus: EmployeeStatus;
  access: ToolAccessState;
};

type UsersContextValue = {
  users: PortalUser[];
  getUserById: (id: string) => PortalUser | undefined;
  inviteUser: (input: InviteInput) => string;
  updateUser: (id: string, patch: Partial<Omit<PortalUser, "id">>) => void;
  pendingToast: string | null;
  clearPendingToast: () => void;
  showToast: (message: string) => void;
};

const UsersContext = createContext<UsersContextValue | null>(null);

// ─── Session-persisted store (survives refresh, cleared when the tab closes) ─

type StoreState = {
  invited: PortalUser[];
  seedOverrides: Record<string, Partial<PortalUser>>;
  toast: string | null;
};

const STORAGE_KEY = "ypp.users";
const EMPTY_STATE: StoreState = { invited: [], seedOverrides: {}, toast: null };

let state: StoreState | null = null;
const listeners = new Set<() => void>();

function readState(): StoreState {
  if (state) return state;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<StoreState>) : null;
    state = { ...EMPTY_STATE, ...parsed, toast: null };
  } catch {
    state = EMPTY_STATE;
  }
  return state;
}

function writeState(next: StoreState) {
  state = next;
  try {
    const persisted = { invited: next.invited, seedOverrides: next.seedOverrides };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // storage unavailable — keep in-memory only
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => readState();
const getServerSnapshot = () => EMPTY_STATE;

// ─── Provider ─────────────────────────────────────────────────────────────────

function withDerivedAccess(u: MockUser, index: number): PortalUser {
  return {
    ...u,
    employeeStatus: index % 3 === 0 ? "non-employee" : "employee",
    inviteSent: false,
    access: {
      ...EMPTY_TOOL_ACCESS,
      operational: { enabled: true, roleId: u.role.toLowerCase() },
      brand: { enabled: true, brandIds: [ACCESS_BRANDS[index % ACCESS_BRANDS.length].id] },
    },
  };
}

export function UsersProvider({ children }: { children: ReactNode }) {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const users = useMemo(() => {
    const seed = getMockUsers().map(withDerivedAccess).map((u) => ({ ...u, ...store.seedOverrides[u.id] }));
    return [...store.invited, ...seed];
  }, [store.invited, store.seedOverrides]);

  const getUserById = useCallback((id: string) => users.find((u) => u.id === id), [users]);

  const inviteUser = useCallback((input: InviteInput) => {
    const id = `invited-${Date.now()}`;
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    const user: PortalUser = {
      id,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: input.email.trim(),
      role: input.access.operational.roleId === "admin" ? "Admin" : "Viewer",
      brand: "—",
      lastSignIn: "No sign-in yet",
      deactivated: false,
      employeeStatus: input.employeeStatus,
      access: input.access,
      inviteSent: true,
    };
    const cur = readState();
    writeState({ ...cur, invited: [user, ...cur.invited], toast: "Invite sent" });
    return id;
  }, []);

  const updateUser = useCallback((id: string, patch: Partial<Omit<PortalUser, "id">>) => {
    const cur = readState();
    if (cur.invited.some((u) => u.id === id)) {
      writeState({ ...cur, invited: cur.invited.map((u) => (u.id === id ? { ...u, ...patch } : u)) });
    } else {
      writeState({ ...cur, seedOverrides: { ...cur.seedOverrides, [id]: { ...cur.seedOverrides[id], ...patch } } });
    }
  }, []);

  const clearPendingToast = useCallback(() => {
    const cur = readState();
    if (cur.toast !== null) writeState({ ...cur, toast: null });
  }, []);

  const showToast = useCallback((message: string) => {
    writeState({ ...readState(), toast: message });
  }, []);

  const value = useMemo<UsersContextValue>(
    () => ({
      users,
      getUserById,
      inviteUser,
      updateUser,
      pendingToast: store.toast,
      clearPendingToast,
      showToast,
    }),
    [users, getUserById, inviteUser, updateUser, store.toast, clearPendingToast, showToast],
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsers(): UsersContextValue {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used within UsersProvider");
  return ctx;
}
