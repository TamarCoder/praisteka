"use client";

import { useId, useState } from "react";
import { Banner } from "@/components/ui/Banner/Banner";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { Input } from "@/components/ui/Input/Input";
import { Modal } from "@/components/ui/Modal/Modal";
import { ModalSize } from "@/components/ui/Modal/Modal.types";
import styles from "./AddRowModal.module.scss";
import type { AddRowModalProps } from "./AddRowModal.types";

// ახალი სერვისი: ფორმა Excel-ის სვეტების მიხედვით; შენახვისას ემატება ფურცლის ბოლოს
export function AddRowModal({ open, columns, onClose, t, onSubmit }: AddRowModalProps) {
  const formId = useId();
  const [values, setValues] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const close = () => {
    setValues([]);
    setError(undefined);
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const row = columns.map((_, i) => (values[i] ?? "").trim());
    if (!row.some(Boolean)) return setError(t.addRowModal.empty);
    setBusy(true);
    try {
      await onSubmit(row);
      close();
    } catch {
      setError(t.errors.save);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={t.addRowModal.title}
      size={ModalSize.Lg}
      closeLabel={t.uploadModal.close}
      footer={
        <>
          <Button variant={ButtonVariant.Secondary} onClick={close} disabled={busy}>
            {t.uploadModal.cancel}
          </Button>
          <Button type="submit" form={formId} loading={busy}>
            {t.addRowModal.submit}
          </Button>
        </>
      }
    >
      <form id={formId} className={styles.form} onSubmit={submit} noValidate>
        {error && <Banner>{error}</Banner>}
        <div className={styles.fields}>
          {columns.map((name, i) => (
            <Field key={i} label={name.trim() || `${t.addRowModal.column} ${i + 1}`}>
              <Input
                autoFocus={i === 0}
                value={values[i] ?? ""}
                onChange={(e) => {
                  const next = [...values];
                  next[i] = e.target.value;
                  setValues(next);
                  setError(undefined);
                }}
              />
            </Field>
          ))}
        </div>
      </form>
    </Modal>
  );
}
