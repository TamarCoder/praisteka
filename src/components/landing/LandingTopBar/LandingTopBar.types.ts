import type { ReactNode } from "react";
import type { ModalSize } from "@/components/ui/Modal/Modal.types";

interface LandingNavModal {
  title: string;
  /** ცარიელი — მოდალი იხსნება შიგთავსის გარეშე */
  content?: ReactNode;
  size?: ModalSize;
}

export interface LandingNavItem {
  id: string;
  label: string;
  /** ბმული (მაგ. „მთავარი“) */
  href?: string;
  /** ან მოდალი */
  modal?: LandingNavModal;
}

export interface LandingTopBarProps {
  items: LandingNavItem[];
  /** მონიშნული პუნქტის id */
  activeId: string;
  loginHref: string;
  loginLabel: string;
  /** ☰ ღილაკის წარწერა ეკრანის წამკითხველისთვის */
  menuLabel: string;
  /** ენა/თემა: დესკტოპზე „შესვლის“ შემდეგ, მობილურზე მენიუში */
  preferences?: ReactNode;
  className?: string;
}
