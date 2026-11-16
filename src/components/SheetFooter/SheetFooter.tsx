import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import { TabsVariant } from "@/components/ui/Tabs/Tabs.types";
import styles from "./SheetFooter.module.scss";
import type { SheetFooterProps } from "./SheetFooter.types";

// 1 App:202
export function SheetFooter({ sheets, value, onChange, sheetsLabel, hint, actionLabel, onAction, actionDisabled }: SheetFooterProps) {
  return (
    <div className={styles.footer}>
      <Tabs items={sheets} value={value} onChange={onChange} variant={TabsVariant.Sheet} label={sheetsLabel} className={styles.tabs} />
      <span className={styles.hint}>{hint}</span>
      <Button variant={ButtonVariant.Text} size={ButtonSize.Sm} className={styles.action} onClick={onAction} disabled={actionDisabled}>
        {actionLabel}
      </Button>
    </div>
  );
}
