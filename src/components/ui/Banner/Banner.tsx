import styles from "./Banner.module.scss";
import { BannerVariant, type BannerProps } from "./Banner.types";

export function Banner({ variant = BannerVariant.Error, children, onClose, className }: BannerProps) {
  const cls = [styles.banner, styles[variant], className].filter(Boolean).join(" ");

  return (
    <div role="alert" className={cls}>
      <span>{children}</span>
      {onClose && (
        <button type="button" aria-label="დახურვა" className={styles.close} onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
}
