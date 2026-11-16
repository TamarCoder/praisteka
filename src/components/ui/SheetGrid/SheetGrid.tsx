"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { columnLetter } from "./columnLetter";
import styles from "./SheetGrid.module.scss";
import { SortDir, type SheetGridProps } from "./SheetGrid.types";

const MOVES: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  Enter: [1, 0],
  Tab: [0, 1],
};

const DEFAULT_COL_WIDTH = 120;
const MIN_COL_WIDTH = 40;
const MAX_FIT_WIDTH = 640;
/** ავტო-სიგანე: ~სიმბოლოს სიგანე px-ში + padding */
const CHAR_PX = 8;
const FIT_PADDING = 28;
/** ვირტუალიზაცია: სტრიქონის სიმაღლე (ზუსტი — პირველი სტრიქონიდან იზომება) და ზედმეტი სტრიქონები ეკრანის ზემოთ/ქვემოთ */
const ROW_GUESS = 37;
const OVERSCAN = 12;

interface Editing {
  row: number;
  col: number;
  draft: string;
}

// 1 App:89-101 — Excel-ის მსგავსი ცხრილი
export function SheetGrid({ columns, widths, rows, selected, onSelect, sort, onSort, onResize, onEdit, onCopy, empty, label, className }: SheetGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ col: number; width: number } | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const cls = [styles.grid, className].filter(Boolean).join(" ");
  // მხოლოდ ხილული სტრიქონები იხატება — ათასობით სტრიქონზეც სწრაფია
  const [port, setPort] = useState({ top: 0, height: 800, head: 0, row: ROW_GUESS });
  const measure = () => {
    const el = ref.current;
    if (!el) return;
    const head = el.querySelector<HTMLElement>(`.${styles.head}`);
    const first = el.querySelector<HTMLElement>("[data-row]");
    setPort((p) => {
      const next = {
        top: el.scrollTop,
        height: el.clientHeight,
        head: head ? head.offsetTop + head.offsetHeight : p.head,
        row: first?.offsetHeight || p.row,
      };
      return next.top === p.top && next.height === p.height && next.head === p.head && next.row === p.row ? p : next;
    });
  };
  useLayoutEffect(measure);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const start = Math.max(0, Math.floor((port.top - port.head) / port.row) - OVERSCAN);
  const end = Math.min(rows.length, Math.ceil((port.top + port.height) / port.row) + OVERSCAN);

  const widthOf = (i: number) => (drag?.col === i ? drag.width : widths?.[i] || DEFAULT_COL_WIDTH);
  // ყველა სტრიქონს ერთი და იგივე სვეტები, რომ ერთ ხაზზე იდგეს
  const template = { "--cols": columns.map((_, i) => `${widthOf(i)}px`).join(" ") } as CSSProperties;

  // მონიშნული უჯრა ყოველთვის ჩანს
  useEffect(() => {
    const el = ref.current;
    if (!selected || !el) return;
    const cell = el.querySelector(`[data-cell="${selected.row}-${selected.col}"]`);
    // სტრიქონი ჯერ არ არის დახატული — ჯერ მასთან გადავდივართ, დახატვის შემდეგ ეფექტი ისევ არ საჭიროებს
    if (cell) cell.scrollIntoView({ block: "nearest", inline: "nearest" });
    else el.scrollTop = port.head + selected.row * port.row - el.clientHeight / 2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const startResize = (col: number) => (e: PointerEvent<HTMLSpanElement>) => {
    if (!onResize) return;
    e.preventDefault();
    const startX = e.clientX;
    const startW = widthOf(col);
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    let width = startW;
    const move = (ev: globalThis.PointerEvent) => {
      width = Math.max(MIN_COL_WIDTH, Math.round(startW + ev.clientX - startX));
      setDrag({ col, width });
    };
    const up = () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      setDrag(null);
      if (width !== startW) onResize(col, width);
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);
  };

  // ორმაგი დაწკაპუნება საზღვარზე — სიგანე ყველაზე გრძელ ტექსტზე
  const fit = (col: number) => {
    const longest = Math.max(columns[col].length, ...rows.map((r) => String(r.cells[col] ?? "").length));
    onResize?.(col, Math.min(MAX_FIT_WIDTH, Math.max(MIN_COL_WIDTH, longest * CHAR_PX + FIT_PADDING)));
  };

  const startEdit = (row: number, col: number, draft?: string) => {
    if (!onEdit) return;
    setEditing({ row, col, draft: draft ?? String(rows[row]?.cells[col] ?? "") });
  };

  const commit = (next?: [number, number]) => {
    if (!editing) return;
    if (editing.draft !== String(rows[editing.row]?.cells[editing.col] ?? "")) onEdit?.(editing.row, editing.col, editing.draft);
    setEditing(null);
    if (next) onSelect({ row: Math.min(editing.row + next[0], rows.length - 1), col: Math.min(editing.col + next[1], columns.length - 1) });
    ref.current?.focus();
  };

  const onEditorKey = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") commit([1, 0]);
    else if (e.key === "Tab") {
      e.preventDefault();
      commit([0, 1]);
    } else if (e.key === "Escape") {
      setEditing(null);
      ref.current?.focus();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!selected || editing) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
      onCopy?.(rows[selected.row]?.cells[selected.col] ?? "");
      return;
    }
    if (onEdit && e.key === "F2") {
      e.preventDefault();
      return startEdit(selected.row, selected.col);
    }
    // ბეჭდვის დაწყება უჯრას ცვლის, როგორც Excel-ში
    if (onEdit && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      return startEdit(selected.row, selected.col, e.key);
    }
    const move = MOVES[e.key];
    if (!move) return;
    e.preventDefault();
    const row = Math.min(Math.max(selected.row + move[0], 0), rows.length - 1);
    const col = Math.min(Math.max(selected.col + move[1], 0), columns.length - 1);
    onSelect({ row, col });
  };

  const arrow = (col: number) => (sort?.col !== col ? "▾" : sort.dir === SortDir.Asc ? "↑" : "↓");

  return (
    <div ref={ref} className={cls} style={template} tabIndex={0} role="grid" aria-label={label} aria-rowcount={rows.length + 1} onKeyDown={onKeyDown} onScroll={measure}>
      <div className={`${styles.row} ${styles.letters}`} role="row">
        <span className={styles.corner} />
        {columns.map((_, i) => (
          <span key={i} className={styles.letter}>
            {columnLetter(i)}
            {onResize && (
              <span
                className={[styles.resizer, drag?.col === i && styles.dragging].filter(Boolean).join(" ")}
                aria-hidden
                onPointerDown={startResize(i)}
                onDoubleClick={() => fit(i)}
              />
            )}
          </span>
        ))}
      </div>
      <div className={`${styles.row} ${styles.head}`} role="row">
        <span className={styles.num}>1</span>
        {columns.map((name, i) => (
          <button key={i} type="button" role="columnheader" title={name} className={styles.headCell} disabled={!rows.length} onClick={() => onSort?.(i)}>
            <span className={styles.truncate}>{name}</span>
            <span aria-hidden>{arrow(i)}</span>
          </button>
        ))}
      </div>
      {start > 0 && <div aria-hidden style={{ height: start * port.row }} />}
      {rows.slice(start, end).map((row, i) => {
        const r = start + i;
        return (
        <div key={row.n} className={styles.row} role="row" data-row>
          <span className={styles.num}>{row.n}</span>
          {columns.map((_, c) => {
            const value = row.cells[c] ?? "";
            const isSel = selected?.row === r && selected.col === c;
            const isEdit = editing?.row === r && editing.col === c;
            return (
              <span
                key={c}
                role="gridcell"
                aria-selected={isSel}
                data-cell={`${r}-${c}`}
                className={[styles.cell, typeof value === "number" && styles.number, isSel && styles.selected].filter(Boolean).join(" ")}
                onClick={() => onSelect({ row: r, col: c })}
                onDoubleClick={() => startEdit(r, c)}
              >
                {isEdit ? (
                  <input
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    autoFocus
                    className={styles.editor}
                    value={editing.draft}
                    onChange={(e) => setEditing({ ...editing, draft: e.target.value })}
                    onKeyDown={onEditorKey}
                    onBlur={() => commit()}
                  />
                ) : (
                  value
                )}
              </span>
            );
          })}
        </div>
        );
      })}
      {end < rows.length && <div aria-hidden style={{ height: (rows.length - end) * port.row }} />}
      {rows.length === 0 && <div className={styles.empty}>{empty}</div>}
    </div>
  );
}
