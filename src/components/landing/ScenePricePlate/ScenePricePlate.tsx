import { Panel } from "@/components/ui/Panel/Panel";
import { PanelPadding, PanelVariant } from "@/components/ui/Panel/Panel.types";
import styles from "../scenePlate.module.scss";
import type { ScenePricePlateProps } from "./ScenePricePlate.types";

export function ScenePricePlate({ query, serviceHeader, priceHeader, rows, className }: ScenePricePlateProps) {
  const cls = [styles.plate, styles.tableGap, className].filter(Boolean).join(" ");

  return (
    <Panel variant={PanelVariant.GlassStrong} padding={PanelPadding.Md} className={cls}>
      <div className={styles.search}>
        <span>{query}</span>
        <span className={styles.caret} />
      </div>
      <div className={`${styles.priceRow} ${styles.priceHead}`}>
        <span>{serviceHeader}</span>
        <span className={styles.price}>{priceHeader}</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.service}
          className={[styles.priceRow, i === 0 ? styles.priceSelected : styles.priceLine].join(" ")}
        >
          <span className={styles.truncate}>{row.service}</span>
          <span className={`${styles.price} ${styles.mono}`}>{row.price}</span>
        </div>
      ))}
    </Panel>
  );
}
