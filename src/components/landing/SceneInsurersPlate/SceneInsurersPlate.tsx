import { Panel } from "@/components/ui/Panel/Panel";
import { PanelPadding, PanelVariant } from "@/components/ui/Panel/Panel.types";
import styles from "../scenePlate.module.scss";
import type { SceneInsurersPlateProps } from "./SceneInsurersPlate.types";

export function SceneInsurersPlate({ title, insurers, selected, className }: SceneInsurersPlateProps) {
  const cls = [styles.plate, styles.base, className].filter(Boolean).join(" ");

  return (
    <Panel variant={PanelVariant.Glass} padding={PanelPadding.Md} className={cls}>
      <div className={styles.caption}>{title}</div>
      {insurers.map((name, i) => (
        <div key={name} className={[styles.row, i === selected ? styles.rowAccent : styles.rowLine].join(" ")}>
          {name}
        </div>
      ))}
    </Panel>
  );
}
