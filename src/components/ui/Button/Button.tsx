import Link from "next/link";
import { Spinner } from "../Spinner/Spinner";
import { SpinnerTone } from "../Spinner/Spinner.types";
import styles from "./Button.module.scss";
import { ButtonSize, ButtonVariant, type ButtonProps } from "./Button.types";

export function Button({
  variant = ButtonVariant.Primary,
  size = ButtonSize.Lg,
  loading = false,
  fullWidth = false,
  href,
  active = false,
  disabled,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    active && styles.active,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={cls} aria-current={active ? "page" : undefined} aria-label={rest["aria-label"]} title={rest.title} onClick={rest.onClick as never}>
        {children}
      </Link>
    );
  }

  const spinnerTone = variant === ButtonVariant.Primary ? SpinnerTone.OnAccent : SpinnerTone.Mute;

  return (
    <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} aria-pressed={active || undefined} {...rest}>
      {loading && <Spinner tone={spinnerTone} />}
      {children}
    </button>
  );
}
