import styles from "./LandingBackground.module.scss";
import type { LandingBackgroundProps } from "./LandingBackground.types";

export function LandingBackground({ className }: LandingBackgroundProps) {
  const cls = [styles.background, className].filter(Boolean).join(" ");

  return (
    <div aria-hidden="true" className={cls}>
      <span className={`${styles.blob} ${styles.blob1}`} />
      <span className={`${styles.blob} ${styles.blob2}`} />
      <span className={`${styles.blob} ${styles.blob3}`} />
    </div>
  );
}
