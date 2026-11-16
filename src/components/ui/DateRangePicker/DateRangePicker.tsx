"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
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
  return [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: count }, (_, i) => i + 1),
  ];
}

// ერთი ველი: პირველი დაჭერა — დასაწყისი, მეორე — დასასრული
export function DateRangePicker({
  value,
  onChange,
  label,
  labels,
  single = false,
  invalid = false,
  className,
}: DateRangePickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState("");
  // თვე და „დღეს“ — მხოლოდ გახსნისას (prerender-ში new Date() არ შეიძლება)
  const [month, setMonth] = useState({ y: 0, m: 0 });
  const [today, setToday] = useState("");
  const popRef = useRef<HTMLDivElement>(null);
  // სათაურზე დაჭერა: დღეები → თვეები → წლები; არჩევა უკან აბრუნებს
  const [view, setView] = useState<"days" | "months" | "years">("days");
  const [place, setPlace] = useState<CSSProperties>({});
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close, popRef);

  // კალენდარი ცურავს ყველაფრის თავზე (portal + fixed): მოდალის scroll-ი არ ჭრის და ფორმას არ წევს.
  // ქვემოთ ადგილი თუ არ არის — ზემოთ იხსნება
  // layout effect — ადგილი იზომება დახატვამდე, კალენდარი კუთხეში არ „ახტება“
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = ref.current?.getBoundingClientRect();
      const pop = popRef.current;
      if (!r || !pop) return;
      const gap = 6;
      const w = pop.offsetWidth;
      const h = pop.offsetHeight;
      const below = window.innerHeight - r.bottom - gap;
      const up = below < h && r.top > below;
      const left = Math.min(
        Math.max(gap, r.right - w),
        window.innerWidth - w - gap,
      );
      setPlace(
        up
          ? { left, bottom: window.innerHeight - r.top + gap }
          : { left, top: r.bottom + gap },
      );
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, month, view]);

  const yearsFrom = month.y - (month.y % 12);

  const toggle = () => {
    if (!open) {
      setView("days");
      const now = new Date();
      const start = value.from ? new Date(value.from) : now;
      setMonth({ y: start.getFullYear(), m: start.getMonth() });
      setToday(iso(now.getFullYear(), now.getMonth(), now.getDate()));
    }
    setOpen((o) => !o);
  };

  // დასაწყისი არჩეულია, დასასრული — ჯერ არა
  const picking = !single && !!value.from && !value.to;
  const end = value.to || (picking ? hover : "");
  const [lo, hi] =
    value.from && end && end < value.from
      ? [end, value.from]
      : [value.from, end];

  const pick = (day: string) => {
    if (single || !picking) {
      onChange({ from: day, to: "" });
      if (single) setOpen(false);
      return;
    }
    const [from, to] = day < value.from ? [day, value.from] : [value.from, day];
    onChange({ from, to });
    setOpen(false);
  };

  const shift = (step: number) =>
    view === "years"
      ? setMonth(({ y, m }) => ({ y: y + step * 12, m }))
      : view === "months"
        ? setMonth(({ y, m }) => ({ y: y + step, m }))
        : setMonth(({ y, m }) => ({
            y: y + Math.floor((m + step) / 12),
            m: (m + step + 12) % 12,
          }));

  const text = value.from
    ? single
      ? formatDate(value.from)
      : `${formatDate(value.from)} – ${value.to ? formatDate(value.to) : "…"}`
    : labels.placeholder;

  return (
    <div
      ref={ref}
      className={[styles.picker, className].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        className={[
          styles.trigger,
          open && styles.open,
          !value.from && styles.empty,
          invalid && styles.invalid,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={label}
        aria-expanded={open}
        onClick={toggle}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
        <span className={styles.value}>{text}</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={popRef}
            className={styles.popover}
            style={place}
            role="dialog"
            aria-label={label}
          >
            <div className={styles.head}>
              <button
                type="button"
                className={styles.nav}
                aria-label={labels.prev}
                onClick={() => shift(-1)}
              >
                ‹
              </button>
              <button
                type="button"
                className={styles.month}
                onClick={() =>
                  setView(
                    view === "days"
                      ? "months"
                      : view === "months"
                        ? "years"
                        : "days",
                  )
                }
              >
                {view === "days"
                  ? `${labels.months[month.m]} ${month.y}`
                  : view === "months"
                    ? month.y
                    : `${yearsFrom} – ${yearsFrom + 11}`}
              </button>
              <button
                type="button"
                className={styles.nav}
                aria-label={labels.next}
                onClick={() => shift(1)}
              >
                ›
              </button>
            </div>
            {view === "months" && (
              <div className={styles.pickGrid}>
                {labels.months.map((name, m) => (
                  <button
                    key={name}
                    type="button"
                    className={[styles.pickCell, m === month.m && styles.edge]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => {
                      setMonth(({ y }) => ({ y, m }));
                      setView("days");
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
            {view === "years" && (
              <div className={styles.pickGrid}>
                {Array.from({ length: 12 }, (_, i) => yearsFrom + i).map(
                  (y) => (
                    <button
                      key={y}
                      type="button"
                      className={[styles.pickCell, y === month.y && styles.edge]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => {
                        setMonth(({ m }) => ({ y, m }));
                        setView("months");
                      }}
                    >
                      {y}
                    </button>
                  ),
                )}
              </div>
            )}
            {view === "days" && (
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
                      className={[
                        styles.day,
                        inside && styles.inside,
                        edge && styles.edge,
                        day === today && styles.today,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-pressed={edge}
                      onPointerEnter={() => picking && setHover(day)}
                      onClick={() => pick(day)}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            )}
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
          </div>,
          document.body,
        )}
    </div>
  );
}
