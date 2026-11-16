import styles from "./EmptyState.module.scss";
import { EmptyStateVariant, type EmptyStateProps } from "./EmptyState.types";

export function EmptyState({ variant = EmptyStateVariant.Empty, icon, title, text, action, className }: EmptyStateProps) {
  const cls = [styles.state, styles[variant], className].filter(Boolean).join(" ");

  return (
    <div role={variant === EmptyStateVariant.Error ? "alert" : undefined} className={cls}>
      {icon && (
        <div className={styles.icon} aria-hidden>
          {icon}
        </div>
      )}
      <div className={styles.title}>{title}</div>
      {text && <div className={styles.text}>{text}</div>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
