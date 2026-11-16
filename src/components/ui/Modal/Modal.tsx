"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";
import { ModalSize, type ModalProps } from "./Modal.types";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = ModalSize.Md,
  closeLabel = "დახურვა",
  className,
}: ModalProps) {
  const titleId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);

  // iPhone: კლავიატურა fixed ფანჯარას არ სწევს — ხილული ნაწილის მიხედვით ქვემოდან ვუმატებთ ადგილს
  useEffect(() => {
    const vv = window.visualViewport;
    if (!open || !vv) return;
    const update = () => {
      const keyboard = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      overlayRef.current?.style.setProperty("--keyboard", `${keyboard}px`);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const cls = [styles.modal, styles[size], className].filter(Boolean).join(" ");

  // body-ში: მშობლის transform/backdrop-filter-მა fixed ფონი არ უნდა შეზღუდოს
  return createPortal(
    <div ref={overlayRef} className={styles.overlay} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className={cls} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button type="button" aria-label={closeLabel} className={styles.close} onClick={onClose} autoFocus>
            ✕
          </button>
        </div>
        {children}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
