"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { Modal } from "@/components/ui/Modal/Modal";
import { ModalSize } from "@/components/ui/Modal/Modal.types";
import { fill } from "@/i18n/fill";
import type { DeleteModalProps } from "./DeleteModal.types";

// სამუდამო წაშლის დადასტურება
export function DeleteModal({ name, onClose, onConfirm, t }: DeleteModalProps) {
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={name !== null}
      onClose={onClose}
      title={t.deleteModal.title}
      size={ModalSize.Md}
      closeLabel={t.uploadModal.close}
      footer={
        <>
          <Button variant={ButtonVariant.Secondary} onClick={onClose} disabled={busy}>
            {t.uploadModal.cancel}
          </Button>
          <Button onClick={confirm} loading={busy}>
            {t.deleteModal.submit}
          </Button>
        </>
      }
    >
      <p>{fill(t.deleteModal.text, { name: name ?? "" })}</p>
    </Modal>
  );
}
