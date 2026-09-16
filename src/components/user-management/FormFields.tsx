"use client";

import { Icon } from "@yahoo/uds";
import { Check, ChevronDown, Cross, Warning } from "@yahoo/uds-icons";
import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useOnClickOutside } from "@/lib/useOnClickOutside";
import type { SelectOption } from "@/lib/toolAccess";

const ERROR_RED = "#d30d2e";

// scrollIntoView also nudges the overflow-hidden document; only the app's scrolling <main> should move.
function scrollWithinContainer(el: HTMLElement) {
  let container: HTMLElement | null = el.parentElement;
  while (container && !/(auto|scroll)/.test(getComputedStyle(container).overflowY)) {
    container = container.parentElement;
  }
  if (!container) return;
  const elRect = el.getBoundingClientRect();
  const boxRect = container.getBoundingClientRect();
  const target = container.scrollTop + (elRect.top - boxRect.top) - boxRect.height / 2 + elRect.height / 2;
  container.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
}

export function FieldLabel({
  htmlFor,
  children,
  required,
  error,
  className,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  error?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block font-yahoo-product-sans text-[14px] font-medium leading-5 ${
        error ? "text-[#d30d2e]" : "text-[#464e56]"
      } ${className ?? ""}`}
    >
      {children}
      {required && <span className="ml-1 font-medium">(required)</span>}
    </label>
  );
}

export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p className="font-yahoo-product-sans text-[12px] leading-4 text-[#d30d2e]">{children}</p>
  );
}

const inputBase =
  "w-full rounded-[4px] border bg-white px-4 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] placeholder:text-[#6e7780] outline-none transition-colors";

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <FieldLabel htmlFor={id} required={required} error={Boolean(error)}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} h-12 ${
          error
            ? "border-[#d30d2e] focus:border-[#d30d2e]"
            : "border-[#828a93] focus:border-[#232a31] focus:shadow-[inset_0_0_0_1px_#232a31]"
        }`}
      />
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

export function RadioGroup<T extends string>({
  id,
  label,
  required,
  name,
  value,
  onChange,
  options,
  error,
}: {
  id?: string;
  label: string;
  required?: boolean;
  name: string;
  value: T | null;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  error?: string;
}) {
  return (
    <fieldset id={id} className="flex w-full flex-col gap-2.5">
      <legend
        className={`font-yahoo-product-sans text-[14px] font-medium leading-5 ${
          error ? "text-[#d30d2e]" : "text-[#464e56]"
        }`}
      >
        {label}
        {required && <span className="ml-1">(required)</span>}
      </legend>
      <div className="flex flex-wrap items-center gap-5">
        {options.map((opt, i) => {
          const checked = value === opt.value;
          return (
            <label key={opt.value} className="flex cursor-pointer items-center gap-1.5 py-2">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="peer sr-only"
                id={id && i === 0 ? `${id}-first` : undefined}
              />
              <span
                aria-hidden
                className={`flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#5D5EFF]/40 ${
                  error ? "border-[#d30d2e]" : "border-[#232a31]"
                }`}
              >
                {checked && <span className="size-2 rounded-full bg-[#232a31]" />}
              </span>
              <span className="font-yahoo-product-sans text-[14px] leading-5 text-[#232a31]">
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </fieldset>
  );
}

export function Checkbox({
  id,
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  id: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={`flex items-center gap-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`flex size-4 shrink-0 items-center justify-center rounded-[2px] border-[1.5px] peer-focus-visible:ring-2 peer-focus-visible:ring-[#5D5EFF]/40 ${
            checked ? "border-[#232a31] bg-[#232a31]" : "border-[#232a31] bg-white"
          }`}
        >
          {checked && <Icon name={Check} size="xs" variant="outline" className="size-3 text-white" />}
        </span>
        <span className="font-yahoo-product-sans text-[14px] leading-5 text-[#232a31]">{label}</span>
      </label>
      {description && (
        <p className="pl-6 font-yahoo-product-sans text-[12px] leading-4 text-[#6e7780]">{description}</p>
      )}
    </div>
  );
}

export function SelectField({
  id,
  label,
  required,
  placeholder = "Select an option",
  value,
  options,
  onChange,
  error,
}: {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string | null;
  options: SelectOption[];
  onChange: (id: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  useOnClickOutside(rootRef, () => setOpen(false), open);

  const selected = options.find((o) => o.id === value) ?? null;

  return (
    <div className="flex w-full flex-col gap-2.5">
      <FieldLabel htmlFor={id} required={required} error={Boolean(error)}>
        {label}
      </FieldLabel>
      <div ref={rootRef} className="relative w-full">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className={`${inputBase} flex h-12 items-center justify-between gap-3 text-left ${
            error
              ? "border-[#d30d2e]"
              : open
                ? "border-[#232a31] shadow-[inset_0_0_0_1px_#232a31]"
                : "border-[#828a93] hover:border-[#464e56]"
          }`}
        >
          <span className={selected ? "text-[#232a31]" : "text-[#6e7780]"}>
            {selected?.label ?? placeholder}
          </span>
          <Icon name={ChevronDown} size="sm" variant="outline" className="size-4 shrink-0 text-[#232a31]" />
        </button>
        {open && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 top-[calc(100%+4px)] z-50 max-h-[320px] w-full overflow-y-auto rounded-[8px] bg-white py-2 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.10),0px_4px_8px_0px_rgba(0,0,0,0.10)]"
          >
            {options.map((o) => {
              const isSelected = o.id === value;
              return (
                <li key={o.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.id);
                      setOpen(false);
                    }}
                    className="flex w-full items-start justify-between gap-3 px-4 py-2.5 text-left hover:bg-[#f5f8fa]"
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="font-yahoo-product-sans text-[14px] leading-5 text-[#232a31]">{o.label}</span>
                      {o.description && (
                        <span className="font-yahoo-product-sans text-[12px] leading-4 text-[#6e7780]">
                          {o.description}
                        </span>
                      )}
                    </span>
                    {isSelected && (
                      <Icon name={Check} size="sm" variant="outline" className="mt-0.5 size-4 shrink-0 text-[#232a31]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

export function MultiSelectField({
  id,
  label,
  required,
  placeholder = "Type to search and select",
  values,
  options,
  onChange,
  error,
}: {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  values: string[];
  options: SelectOption[];
  onChange: (next: string[]) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  useOnClickOutside(
    rootRef,
    () => {
      setOpen(false);
      setQuery("");
    },
    open,
  );

  const selectedSet = useMemo(() => new Set(values), [values]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  function toggle(optId: string) {
    onChange(selectedSet.has(optId) ? values.filter((v) => v !== optId) : [...values, optId]);
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="flex w-full flex-col gap-2.5">
      <FieldLabel htmlFor={id} required={required} error={Boolean(error)}>
        {label}
      </FieldLabel>
      <div ref={rootRef} className="relative w-full">
        <div
          onClick={() => {
            setOpen(true);
            inputRef.current?.focus();
          }}
          className={`${inputBase} relative flex min-h-12 cursor-text flex-wrap items-center gap-2 py-2 pr-11 ${
            error
              ? "border-[#d30d2e]"
              : open
                ? "border-[#232a31] shadow-[inset_0_0_0_1px_#232a31]"
                : "border-[#828a93] hover:border-[#464e56]"
          }`}
        >
          {values.map((v) => {
            const opt = options.find((o) => o.id === v);
            if (!opt) return null;
            return (
              <span
                key={v}
                className="inline-flex h-8 items-center gap-1 rounded-full bg-[#f0f3f5] pl-3 pr-2 font-yahoo-product-sans text-[12px] font-medium leading-4 text-[#232a31]"
              >
                {opt.label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(v);
                  }}
                  className="flex size-5 items-center justify-center rounded-full hover:bg-[#e0e4e9]"
                  aria-label={`Remove ${opt.label}`}
                >
                  <Icon name={Cross} size="xs" variant="outline" className="size-3 text-[#232a31]" />
                </button>
              </span>
            );
          })}
          <input
            ref={inputRef}
            id={id}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            value={query}
            placeholder={values.length === 0 ? placeholder : ""}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && query === "" && values.length > 0) {
                onChange(values.slice(0, -1));
              }
              if (e.key === "Escape") setOpen(false);
            }}
            className="min-w-[80px] flex-1 bg-transparent py-1 font-yahoo-product-sans text-[14px] leading-5 text-[#232a31] placeholder:text-[#6e7780] outline-none"
          />
          <Icon
            name={ChevronDown}
            size="sm"
            variant="outline"
            className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#232a31]"
          />
        </div>
        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-multiselectable
            className="absolute left-0 top-[calc(100%+4px)] z-50 max-h-[320px] w-full overflow-y-auto rounded-[8px] bg-white py-2 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.10),0px_4px_8px_0px_rgba(0,0,0,0.10)]"
          >
            {visible.length === 0 ? (
              <li className="px-4 py-2.5 font-yahoo-product-sans text-[13px] text-[#828a93]">
                No results for &ldquo;{query}&rdquo;
              </li>
            ) : (
              visible.map((o) => {
                const isSelected = selectedSet.has(o.id);
                return (
                  <li key={o.id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => toggle(o.id)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[#f5f8fa]"
                    >
                      <span
                        aria-hidden
                        className={`flex size-4 shrink-0 items-center justify-center rounded-[2px] border-[1.5px] ${
                          isSelected ? "border-[#232a31] bg-[#232a31]" : "border-[#232a31] bg-white"
                        }`}
                      >
                        {isSelected && <Icon name={Check} size="xs" variant="outline" className="size-3 text-white" />}
                      </span>
                      <span className="font-yahoo-product-sans text-[14px] leading-5 text-[#232a31]">{o.label}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

export function FormErrorBanner({
  title = "There are some problems with your user details:",
  items,
}: {
  title?: string;
  items: { id: string; label: string; targetId: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div
      role="alert"
      className="flex w-full flex-col gap-3 rounded-[8px] border-2 bg-[#fffafa] px-6 py-5"
      style={{ borderColor: ERROR_RED }}
    >
      <div className="flex items-center gap-2">
        <Icon name={Warning} size="sm" variant="fill" className="size-4 shrink-0 text-[#d30d2e]" />
        <p className="font-yahoo-product-sans text-[16px] font-medium leading-5 text-[#232a31]">{title}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById(item.targetId);
                if (!el) return;
                scrollWithinContainer(el);
                el.focus({ preventScroll: true });
              }}
              className="font-yahoo-product-sans text-[14px] font-medium leading-5 text-[#232a31] underline hover:no-underline"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
