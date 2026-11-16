"use client";

import { useEffect, type RefObject } from "react";

/** გარეთ დაჭერა ან Esc ხურავს ჩამოსაშლელს */
/** extra — მაგ. portal-ში გატანილი popover, რომელიც ref-ის შიგნით არ არის */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, close: () => void, extra?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!ref.current?.contains(target) && !extra?.current?.contains(target)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, open, close, extra]);
}
