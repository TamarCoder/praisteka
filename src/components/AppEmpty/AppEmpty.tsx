import { Button } from "@/components/ui/Button/Button";
import { ButtonSize } from "@/components/ui/Button/Button.types";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { StateIcon } from "@/components/StateIcons/StateIcons";
import styles from "./AppEmpty.module.scss";
import type { AppEmptyProps } from "./AppEmpty.types";

// პირველი შესვლა — ჯერ არაფერი აიტვირთა
export function AppEmpty({ title, text, actionLabel, onAction }: AppEmptyProps) {
  return (
    <div className={styles.empty}>
      <EmptyState
        icon={StateIcon.upload}
        title={title}
        text={text}
        action={
          <Button size={ButtonSize.Lg} onClick={onAction}>
            {actionLabel}
          </Button>
        }
      />
    </div>
  );
}
