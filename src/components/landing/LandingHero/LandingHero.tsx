import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import styles from "./LandingHero.module.scss";
import type { LandingHeroProps } from "./LandingHero.types";

export function LandingHero({ title, text, primaryAction, secondaryAction, className }: LandingHeroProps) {
  const cls = [styles.hero, className].filter(Boolean).join(" ");

  return (
    <div className={cls}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>{text}</p>
      <div className={styles.actions}>
        <Button href={primaryAction.href} variant={ButtonVariant.Primary} size={ButtonSize.Xl}>
          {primaryAction.label}
        </Button>
        <Button href={secondaryAction.href} variant={ButtonVariant.Glass} size={ButtonSize.Xl}>
          {secondaryAction.label}
        </Button>
      </div>
    </div>
  );
}
