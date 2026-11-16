"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { Input } from "@/components/ui/Input/Input";
import { Modal } from "@/components/ui/Modal/Modal";
import { ModalSize } from "@/components/ui/Modal/Modal.types";
import type { FolderModalProps } from "./FolderModal.types";

export function FolderModal({ open, onClose, t, onSubmit }: FolderModalProps) {
  const formId = useId();
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const close = () => {
    setName("");
    setError(undefined);
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError(t.errors.folderName);
    setBusy(true);
    try {
      const failed = await onSubmit(name);
      if (failed) return setError(failed);
      close();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={t.folderModal.title}
      size={ModalSize.Md}
      closeLabel={t.uploadModal.close}
      footer={
        <>
          <Button variant={ButtonVariant.Secondary} onClick={close} disabled={busy}>
            {t.uploadModal.cancel}
          </Button>
          <Button type="submit" form={formId} loading={busy}>
            {t.folderModal.submit}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate>
        <Field label={t.folderModal.name} error={error}>
          <Input
            autoFocus
            autoComplete="off"
            placeholder={t.folderModal.placeholder}
            invalid={!!error}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(undefined);
            }}
          />
        </Field>
      </form>
    </Modal>
  );
}
