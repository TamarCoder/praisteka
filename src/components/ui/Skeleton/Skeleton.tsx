import styles from "./Skeleton.module.scss";
import type { SkeletonProps } from "./Skeleton.types";

export function Skeleton({ width = "100%", height = 12, className }: SkeletonProps) {
  const cls = [styles.skeleton, className].filter(Boolean).join(" ");

  return <div aria-hidden="true" className={cls} style={{ width, height }} />;
}
