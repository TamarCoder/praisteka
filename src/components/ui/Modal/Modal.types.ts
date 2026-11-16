import type { ReactNode } from "react";

export enum ModalSize {
  /** 440px — ფორმები, ატვირთვა */
  Md = "md",
  /** 560px — ტექსტი, აღწერა */
  Lg = "lg",
}

export interface ModalProps {
  open: boolean;
  /** Esc, ფონზე დაჭერა, ✕ */
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  /** ღილაკები ქვემოთ, მარჯვნივ */
  footer?: ReactNode;
  size?: ModalSize;
  /** ✕ ღილაკის წარწერა ეკრანის წამკითხველისთვის */
  closeLabel?: string;
  className?: string;
}
