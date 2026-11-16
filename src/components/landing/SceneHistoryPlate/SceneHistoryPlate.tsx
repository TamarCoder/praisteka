import { Badge } from "@/components/ui/Badge/Badge";
import { Panel } from "@/components/ui/Panel/Panel";
import { PanelPadding, PanelVariant } from "@/components/ui/Panel/Panel.types";
import styles from "../scenePlate.module.scss";
import type { SceneHistoryPlateProps } from "./SceneHistoryPlate.types";

export function SceneHistoryPlate({ title, dates, currentLabel, className }: SceneHistoryPlateProps) {
  const cls = [styles.plate, className].filter(Boolean).join(" ");

  return (
    <Panel variant={PanelVariant.Glass} padding={PanelPadding.Md} className={cls}>
      <div className={styles.caption}>{title}</div>
      {dates.map((date, i) =>
        i === 0 ? (
          <div key={date} className={`${styles.row} ${styles.rowTall} ${styles.rowCurrent}`}>
            <span className={styles.mono}>{date}</span>
            <Badge>{currentLabel}</Badge>
          </div>
        ) : (
          <div key={date} className={`${styles.row} ${styles.rowTall} ${styles.rowLine} ${styles.mono}`}>
            {date}
          </div>
        ),
      )}
    </Panel>
  );
}
