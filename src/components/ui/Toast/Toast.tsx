"use client";

import { useEffect } from "react";
import styles from "./Toast.module.scss";
import type { ToastProps } from "./Toast.types";

export function Toast({ message, onClose, duration = 2200, className }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;
  const cls = [styles.toast, className].filter(Boolean).join(" ");

  return (
    <div role="status" aria-live="polite" className={cls}>
      {message}
    </div>
  );
}
