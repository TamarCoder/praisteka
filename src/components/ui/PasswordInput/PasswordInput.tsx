"use client";

import { useState } from "react";
import { Input } from "../Input/Input";
import styles from "./PasswordInput.module.scss";
import type { PasswordInputProps } from "./PasswordInput.types";

export function PasswordInput({ labels, className, disabled, ...rest }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const cls = [styles.wrap, className].filter(Boolean).join(" ");

  return (
    <span className={cls}>
      <Input type={visible ? "text" : "password"} className={styles.input} disabled={disabled} {...rest} />
      <button
        type="button"
        className={styles.toggle}
        aria-label={visible ? labels.hide : labels.show}
        aria-pressed={visible}
        disabled={disabled}
        onClick={() => setVisible((v) => !v)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="M4 4l16 16" />}
        </svg>
      </button>
    </span>
  );
}
