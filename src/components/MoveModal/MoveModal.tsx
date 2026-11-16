"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { Modal } from "@/components/ui/Modal/Modal";
import { ModalSize } from "@/components/ui/Modal/Modal.types";
import { Select } from "@/components/ui/Select/Select";
import type { MoveModalProps } from "./MoveModal.types";

// ფაილის გადატანა ფოლდერში (ან ფოლდერიდან გამოტანა)
export function MoveModal({ name, current, folders, onClose, onConfirm, t }: MoveModalProps) {
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const value = picked ?? current;

  const close = () => {
    setPicked(null);
    onClose();
  };

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm(value);
      setPicked(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={name !== null}
      onClose={close}
      title={t.moveModal.title}
      size={ModalSize.Md}
      closeLabel={t.uploadModal.close}
      footer={
        <>
          <Button variant={ButtonVariant.Secondary} onClick={close} disabled={busy}>
            {t.uploadModal.cancel}
          </Button>
          <Button onClick={confirm} loading={busy} disabled={value === current}>
            {t.moveModal.submit}
          </Button>
        </>
      }
    >
      <p>{name}</p>
      <Field label={t.uploadModal.folder}>
        <Select options={folders} value={value} onChange={(e) => setPicked(e.target.value)} />
      </Field>
    </Modal>
  );
}
