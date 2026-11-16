"use client";

import { useCallback, useId, useRef, useState, type KeyboardEvent } from "react";
import { useDismiss } from "@/hooks/useDismiss";
import styles from "./Dropdown.module.scss";
import type { DropdownProps } from "./Dropdown.types";

// ბრაუზერის <select>-ის ნაცვლად — ჩვენი დიზაინის სია
export function Dropdown({ options, value, onChange, label, className }: DropdownProps) {
  const listId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(0);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const current = options.find((o) => o.value === value) ?? options[0];

  const toggle = () => {
    setFocus(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen((o) => !o);
  };

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      return toggle();
    }
    if (!open) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setFocus((f) => (f + step + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(options[focus].value);
    }
  };

  return (
    <div ref={ref} className={[styles.dropdown, className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className={[styles.trigger, open && styles.open].filter(Boolean).join(" ")}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <span className={styles.value}>{current?.label}</span>
        <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul id={listId} role="listbox" aria-label={label} className={styles.menu}>
          {options.map((o, i) => {
            const selected = o.value === value;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={selected}
                className={[styles.option, i === focus && styles.focused, selected && styles.selected].filter(Boolean).join(" ")}
                onPointerEnter={() => setFocus(i)}
                onClick={() => pick(o.value)}
              >
                <span className={styles.value}>{o.label}</span>
                {selected && (
                  <svg className={styles.check} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
