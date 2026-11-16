"use client";

import { Modal } from "@/components/ui/Modal/Modal";
import { ModalSize } from "@/components/ui/Modal/Modal.types";
import styles from "./CompareModal.module.scss";
import type { CompareModalProps } from "./CompareModal.types";

// მონიშნული სტრიქონები გვერდიგვერდ — თითოეული თავისი ფაილის სათაურებით
export function CompareModal({ open, onClose, items, t }: CompareModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={t.globalSearch.compareTitle} size={ModalSize.Lg} closeLabel={t.uploadModal.close}>
      <div className={styles.list}>
        {items.map((item) => {
          const cols = Array.from({ length: Math.max(item.header.length, item.cells.length) }, (_, i) => i).filter(
            (i) => (item.cells[i] ?? "") !== "" || (item.header[i] ?? "") !== "",
          );
          return (
            <section key={item.key} className={styles.item}>
              <h3 className={styles.title}>{item.title}</h3>
              <div className={styles.scroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {cols.map((i) => (
                        <th key={i}>{String(item.header[i] ?? "")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {cols.map((i) => (
                        <td key={i} className={typeof item.cells[i] === "number" ? styles.number : undefined}>
                          {String(item.cells[i] ?? "")}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </Modal>
  );
}
