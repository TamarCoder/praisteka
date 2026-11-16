"use client";

import { useCallback, useRef, useState } from "react";
import { useDismiss } from "@/hooks/useDismiss";
import { formatDate } from "@/lib/formatDate";
import styles from "./DateRangePicker.module.scss";
import type { DateRangePickerProps } from "./DateRangePicker.types";

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

/** თვის უჯრები ორშაბათიდან; null — ცარიელი ადგილი */
function monthDays(y: number, m: number) {
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const count = new Date(y, m + 1, 0).getDate();
  return [...Array<null>(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
}

// ერთი ველი: პირველი დაჭერა — დასაწყისი, მეორე — დასასრული
export function DateRangePicker({ value, onChange, label, labels, className }: DateRangePickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState("");
  // თვე და „დღეს“ — მხოლოდ გახსნისას (prerender-ში new Date() არ შეიძლება)
  const [month, setMonth] = useState({ y: 0, m: 0 });
  const [today, setToday] = useState("");
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const toggle = () => {
    if (!open) {
      const now = new Date();
      const start = value.from ? new Date(value.from) : now;
      setMonth({ y: start.getFullYear(), m: start.getMonth() });
      setToday(iso(now.getFullYear(), now.getMonth(), now.getDate()));
    }
    setOpen((o) => !o);
  };

  // დასაწყისი არჩეულია, დასასრული — ჯერ არა
  const picking = !!value.from && !value.to;
  const end = value.to || (picking ? hover : "");
  const [lo, hi] = value.from && end && end < value.from ? [end, value.from] : [value.from, end];

  const pick = (day: string) => {
    if (!picking) return onChange({ from: day, to: "" });
    const [from, to] = day < value.from ? [day, value.from] : [value.from, day];
    onChange({ from, to });
    setOpen(false);
  };

  const shift = (step: number) =>
    setMonth(({ y, m }) => ({ y: y + Math.floor((m + step) / 12), m: (m + step + 12) % 12 }));

  const text = value.from
    ? `${formatDate(value.from)} – ${value.to ? formatDate(value.to) : "…"}`
    : labels.placeholder;

  return (
    <div ref={ref} className={[styles.picker, className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className={[styles.trigger, open && styles.open, !value.from && styles.empty].filter(Boolean).join(" ")}
        aria-label={label}
        aria-expanded={open}
        onClick={toggle}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
        <span className={styles.value}>{text}</span>
      </button>

      {open && (
        <div className={styles.popover} role="dialog" aria-label={label}>
          <div className={styles.head}>
            <button type="button" className={styles.nav} aria-label={labels.prev} onClick={() => shift(-1)}>
              ‹
            </button>
            <span className={styles.month}>{`${labels.months[month.m]} ${month.y}`}</span>
            <button type="button" className={styles.nav} aria-label={labels.next} onClick={() => shift(1)}>
              ›
            </button>
          </div>
          <div className={styles.grid} onPointerLeave={() => setHover("")}>
            {labels.weekdays.map((w) => (
              <span key={w} className={styles.weekday}>
                {w}
              </span>
            ))}
            {monthDays(month.y, month.m).map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const day = iso(month.y, month.m, d);
              const edge = day === lo || day === hi;
              const inside = !!lo && !!hi && day > lo && day < hi;
              return (
                <button
                  key={day}
                  type="button"
                  className={[styles.day, inside && styles.inside, edge && styles.edge, day === today && styles.today].filter(Boolean).join(" ")}
                  aria-pressed={edge}
                  onPointerEnter={() => picking && setHover(day)}
                  onClick={() => pick(day)}
                >
                  {d}
                </button>
              );
            })}
          </div>
          {value.from && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => {
                onChange({ from: "", to: "" });
                setOpen(false);
              }}
            >
              {labels.clear}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
