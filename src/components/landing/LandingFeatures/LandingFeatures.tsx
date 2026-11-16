import { Panel } from "@/components/ui/Panel/Panel";
import { PanelPadding, PanelVariant } from "@/components/ui/Panel/Panel.types";
import styles from "./LandingFeatures.module.scss";
import type { LandingFeaturesProps } from "./LandingFeatures.types";

export function LandingFeatures({ items, className }: LandingFeaturesProps) {
  const cls = [styles.list, className].filter(Boolean).join(" ");

  return (
    <ul className={cls}>
      {items.map((item) => (
        <li key={item.title}>
          <Panel variant={PanelVariant.Glass} padding={PanelPadding.Md} className={styles.card}>
            <span aria-hidden="true" className={styles.icon}>
              {item.icon}
            </span>
            <span className={styles.body}>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.text}>{item.text}</span>
            </span>
          </Panel>
        </li>
      ))}
    </ul>
  );
}
