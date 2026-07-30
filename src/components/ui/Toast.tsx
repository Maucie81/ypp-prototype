"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@yahoo/uds";
import { CheckCircle, Cross } from "@yahoo/uds-icons";

/** Must match the transition duration below so unmount doesn't cut the exit short. */
const TRANSITION_MS = 320;
/** Brief pause before the entrance starts, so it reads as a deliberate beat rather than instant. */
const ENTER_DELAY_MS = 150;

export function Toast({
  open,
  message,
  onClose,
  duration = 5000,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}) {
  const [rendered, setRendered] = useState(open);
  const [shown, setShown] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Two-phase mount, with a short pause before the entrance starts, so the
  // initial paint happens in the hidden state before transitioning to shown —
  // otherwise the browser has nothing to animate from (and it reads as instant).
  useEffect(() => {
    if (open) {
      if (exitTimer.current) clearTimeout(exitTimer.current);
      setRendered(true);
      enterTimer.current = setTimeout(() => setShown(true), ENTER_DELAY_MS);
      return () => {
        if (enterTimer.current) clearTimeout(enterTimer.current);
      };
    }
    if (enterTimer.current) clearTimeout(enterTimer.current);
    setShown(false);
    exitTimer.current = setTimeout(() => setRendered(false), TRANSITION_MS);
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!rendered || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-[8px] bg-[#232a31] py-4 pl-4 pr-3 shadow-[0px_4px_16px_rgba(0,0,0,0.2)] transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown
          ? "translate-y-0 scale-100 opacity-100 duration-[320ms]"
          : "translate-y-3 scale-95 opacity-0 duration-[200ms]"
      }`}
    >
      <Icon name={CheckCircle} size="sm" variant="fill" className="size-5 shrink-0 text-[#36ad84]" />
      <p className="whitespace-nowrap font-yahoo-product-sans text-[14px] font-medium leading-5 text-white">
        {message}
      </p>
      <button
        onClick={onClose}
        className="flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        aria-label="Dismiss"
      >
        <Icon name={Cross} size="xs" variant="outline" className="size-3.5 text-white" />
      </button>
    </div>,
    document.body,
  );
}
