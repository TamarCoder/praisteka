"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { Logo } from "@/components/ui/Logo/Logo";
import { LogoSize } from "@/components/ui/Logo/Logo.types";
import { Modal } from "@/components/ui/Modal/Modal";
import styles from "./LandingTopBar.module.scss";
import type { LandingNavItem, LandingTopBarProps } from "./LandingTopBar.types";

export function LandingTopBar({
  items,
  activeId,
  loginHref,
  loginLabel,
  menuLabel,
  preferences,
  className,
}: LandingTopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalId, setModalId] = useState<string | null>(null);
  const openItem = items.find((item) => item.id === modalId);

  const cls = [styles.bar, className].filter(Boolean).join(" ");
  const navCls = [styles.nav, menuOpen && styles.navOpen].filter(Boolean).join(" ");

  const select = (item: LandingNavItem) => {
    setMenuOpen(false);
    if (item.modal) setModalId(item.id);
  };

  return (
    <header className={cls}>
      <Logo size={LogoSize.Sm} />

      <nav id="landing-nav" className={navCls}>
        {items.map((item) => (
          <Button
            key={item.id}
            href={item.href}
            active={item.id === activeId}
            variant={ButtonVariant.Ghost}
            size={ButtonSize.Sm}
            className={styles.navItem}
            onClick={() => select(item)}
          >
            {item.label}
          </Button>
        ))}
        {preferences && <div className={styles.navPrefs}>{preferences}</div>}
      </nav>

      <div className={styles.actions}>
        <Button href={loginHref} variant={ButtonVariant.Ghost} size={ButtonSize.Sm}>
          {loginLabel}
        </Button>
        {preferences && <div className={styles.barPrefs}>{preferences}</div>}
        <Button
          variant={ButtonVariant.Ghost}
          size={ButtonSize.Sm}
          className={styles.burger}
          aria-label={menuLabel}
          aria-expanded={menuOpen}
          aria-controls="landing-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </Button>
      </div>

      <Modal
        open={!!openItem?.modal}
        onClose={() => setModalId(null)}
        title={openItem?.modal?.title ?? ""}
        size={openItem?.modal?.size}
      >
        {openItem?.modal?.content}
      </Modal>
    </header>
  );
}
