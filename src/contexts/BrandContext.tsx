"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export const DEFAULT_BRAND_ID = "datapulse-main";

type BrandContextValue = {
  brandId: string;
  setBrandId: (id: string) => void;
  isSwitching: boolean;
};

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandId, setBrandIdState] = useState<string>(DEFAULT_BRAND_ID);
  const [isSwitching, setIsSwitching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setBrandId = useCallback((id: string) => {
    if (id === brandId) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsSwitching(true);
    setBrandIdState(id);
    timerRef.current = setTimeout(() => setIsSwitching(false), 700);
  }, [brandId]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const value = useMemo<BrandContextValue>(
    () => ({ brandId, setBrandId, isSwitching }),
    [brandId, setBrandId, isSwitching]
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) return { brandId: DEFAULT_BRAND_ID, setBrandId: () => {}, isSwitching: false };
  return ctx;
}
