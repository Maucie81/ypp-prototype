"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Two-phase mount/reveal for staggered enter animations. `rendered` controls
 * whether the element is in the DOM; `shown` controls the visible/transitioned
 * state. The gap between mount and `shown` flipping true is what lets a CSS
 * transition actually animate (a element born already in its target state has
 * nothing to transition from).
 */
export function useDelayedReveal(active: boolean, enterDelayMs: number, exitMs: number) {
  const [rendered, setRendered] = useState(active);
  const [shown, setShown] = useState(false);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active) {
      if (exitTimer.current) clearTimeout(exitTimer.current);
      setRendered(true);
      enterTimer.current = setTimeout(() => setShown(true), enterDelayMs);
      return () => {
        if (enterTimer.current) clearTimeout(enterTimer.current);
      };
    }
    if (enterTimer.current) clearTimeout(enterTimer.current);
    setShown(false);
    exitTimer.current = setTimeout(() => setRendered(false), exitMs);
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, [active, enterDelayMs, exitMs]);

  return [rendered, shown] as const;
}
