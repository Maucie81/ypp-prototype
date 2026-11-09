"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Toast } from "@/components/ui/Toast";

type DeletedContentContextValue = {
  /** Removes the content from every list and from search, and confirms with a toast. */
  deleteContent: (title: string) => void;
  isDeleted: (title: string) => boolean;
};

const DeletedContentContext = createContext<DeletedContentContextValue | null>(null);

/**
 * Tracks deleted content for the session, so a reload restores the mock data.
 * Keyed by title because that's the one identity shared across surfaces: the
 * same story has a different mock id in Top content, search and Feed health.
 */
export function DeletedContentProvider({ children }: { children: ReactNode }) {
  const [deletedTitles, setDeletedTitles] = useState<ReadonlySet<string>>(new Set());
  const [toastOpen, setToastOpen] = useState(false);

  const deleteContent = useCallback((title: string) => {
    setDeletedTitles((prev) => new Set(prev).add(title));
    setToastOpen(true);
  }, []);
  const closeToast = useCallback(() => setToastOpen(false), []);

  const value = useMemo<DeletedContentContextValue>(
    () => ({ deleteContent, isDeleted: (title) => deletedTitles.has(title) }),
    [deleteContent, deletedTitles],
  );

  return (
    <DeletedContentContext.Provider value={value}>
      {children}
      <Toast open={toastOpen} message="Content deletion confirmed" onClose={closeToast} />
    </DeletedContentContext.Provider>
  );
}

export function useDeletedContent(): DeletedContentContextValue {
  const ctx = useContext(DeletedContentContext);
  if (!ctx) throw new Error("useDeletedContent must be used inside DeletedContentProvider");
  return ctx;
}
