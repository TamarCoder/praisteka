import styles from "./Logo.module.scss";
import { LogoSize, type LogoProps } from "./Logo.types";

export function Logo({ size = LogoSize.Md, withText = true, className }: LogoProps) {
  const cls = [styles.logo, styles[size], className].filter(Boolean).join(" ");

  return (
    <span className={cls}>
      <span className={styles.mark} aria-hidden={withText} role={withText ? undefined : "img"} aria-label={withText ? undefined : "პრაისთეკა"} />
      {withText && <span className={styles.name}>პრაისთეკა</span>}
    </span>
  );
}
