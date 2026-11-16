"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { Input } from "@/components/ui/Input/Input";
import { Modal } from "@/components/ui/Modal/Modal";
import { ModalSize } from "@/components/ui/Modal/Modal.types";
import type { SaveVersionModalProps } from "./SaveVersionModal.types";

// ვერსია იქმნება მხოლოდ აქედან
export function SaveVersionModal({ open, onClose, t, onSubmit }: SaveVersionModalProps) {
  const formId = useId();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const close = () => {
    setNote("");
    onClose();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit(note);
      close();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={t.saveModal.title}
      size={ModalSize.Md}
      closeLabel={t.uploadModal.close}
      footer={
        <>
          <Button variant={ButtonVariant.Secondary} onClick={close} disabled={busy}>
            {t.uploadModal.cancel}
          </Button>
          <Button type="submit" form={formId} loading={busy}>
            {t.saveModal.submit}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate>
        <Field label={t.saveModal.note}>
          <Input autoFocus autoComplete="off" placeholder={t.saveModal.placeholder} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}
