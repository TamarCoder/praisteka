import { Logo } from "@/components/ui/Logo/Logo";
import { LogoSize } from "@/components/ui/Logo/Logo.types";
import { Panel } from "@/components/ui/Panel/Panel";
import { PanelPadding, PanelVariant } from "@/components/ui/Panel/Panel.types";
import { SegmentedControl } from "@/components/ui/SegmentedControl/SegmentedControl";
import { SegmentedSize } from "@/components/ui/SegmentedControl/SegmentedControl.types";
import styles from "./AuthCard.module.scss";
import { AuthMode, type AuthCardProps } from "./AuthCard.types";

// 2 Auth:21-52
export function AuthCard({ mode, onModeChange, modeLabels, title, text, busy, hint, children }: AuthCardProps) {
  const items = modeLabels && [AuthMode.Login, AuthMode.Register].map((value) => ({ value, label: modeLabels[value] }));

  return (
    <div className={styles.card}>
      <Logo size={LogoSize.Lg} className={styles.logo} />
      <Panel variant={PanelVariant.Paper} padding={PanelPadding.Lg} className={styles.panel}>
        {mode && items && onModeChange && (
          <SegmentedControl items={items} value={mode} onChange={onModeChange} size={SegmentedSize.Md} disabled={busy} />
        )}
        {title && (
          <header className={styles.head}>
            <h1 className={styles.title}>{title}</h1>
            {text && <p className={styles.text}>{text}</p>}
          </header>
        )}
        {children}
      </Panel>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
