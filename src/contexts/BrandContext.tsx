"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export const DEFAULT_BRAND_ID = "datapulse-main";

type BrandContextValue = {
  brandId: string;
  setBrandId: (id: string) => void;
};

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandId, setBrandId] = useState<string>(DEFAULT_BRAND_ID);
  const value = useMemo<BrandContextValue>(() => ({ brandId, setBrandId }), [brandId]);
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) return { brandId: DEFAULT_BRAND_ID, setBrandId: () => {} };
  return ctx;
}
