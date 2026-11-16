import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import styles from "./AuthSuccess.module.scss";
import type { AuthSuccessProps } from "./AuthSuccess.types";

// 2 Auth:30-36
export function AuthSuccess({ title, text, children }: AuthSuccessProps) {
  return <EmptyState title={title} text={text} action={<div className={styles.actions}>{children}</div>} />;
}
