"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { StateIcon } from "@/components/StateIcons/StateIcons";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { useBelowDesktop, useElementById } from "@/hooks/useBelowDesktop";
import { Input } from "@/components/ui/Input/Input";
import { InputVariant } from "@/components/ui/Input/Input.types";
import styles from "./FileHeader.module.scss";
import type { FileHeaderProps } from "./FileHeader.types";

// მარცხნივ: ძებნა · მარჯვნივ: ღილაკები · ქვემოთ ხაზი
export function FileHeader({ query, onQueryChange, placeholder, searchLabel, disabled, actions, scope }: FileHeaderProps) {
  // ტაბლეტი/მობილური: ღილაკები ზედა ზოლში, ლოგოს გვერდით
  const below = useBelowDesktop();
  const slot = useElementById("app-bar-actions", below);
  // ზედა ზოლში 🔍: დაჭერით ძებნა რბილად ჩამოიშლება; ტექსტი თუ წერია — ღიად რჩება
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shown = !slot || searchOpen || !!query;
  const toggle = () => {
    setSearchOpen((open) => !open);
    if (!shown) requestAnimationFrame(() => inputRef.current?.focus());
  };
  const searchButton = (
    <Button
      size={ButtonSize.Sm}
      variant={ButtonVariant.Ghost}
      iconOnly
      onClick={toggle}
      aria-label={searchLabel}
      aria-expanded={shown}
      title={searchLabel}
    >
      {StateIcon.search}
    </Button>
  );
  return (
    <div className={[styles.header, slot && styles.collapsible, shown && styles.open].filter(Boolean).join(" ")}>
      <div className={styles.start}>
        <Input
          ref={inputRef}
          type="search"
          variant={InputVariant.Search}
          className={styles.search}
          value={query}
          placeholder={placeholder}
          aria-label={searchLabel}
          disabled={disabled}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {scope}
      </div>
      {actions && (slot ? createPortal(
            <>
              {searchButton}
              {actions}
            </>,
            slot,
          ) : <div className={styles.actions}>{actions}</div>)}
    </div>
  );
}
