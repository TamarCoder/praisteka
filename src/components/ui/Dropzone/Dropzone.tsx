"use client";

import { useState, type DragEvent } from "react";
import styles from "./Dropzone.module.scss";
import type { DropzoneProps } from "./Dropzone.types";

export function Dropzone({ label, hint, accept, onFile, invalid = false, disabled = false, className }: DropzoneProps) {
  // მხოლოდ ვიზუალური მდგომარეობა: ფაილი ზემოთ არის თუ არა
  const [over, setOver] = useState(false);
  const cls = [styles.dropzone, over && styles.over, invalid && styles.invalid, disabled && styles.disabled, className]
    .filter(Boolean)
    .join(" ");

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files[0];
    if (file && !disabled) onFile(file);
  };

  return (
    <label
      className={cls}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        className={styles.file}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      <span className={styles.label}>{label}</span>
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}
