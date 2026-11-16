import type { ButtonHTMLAttributes, ReactNode } from "react";

export enum ButtonVariant {
  /** acc ფონი — მთავარი მოქმედება */
  Primary = "primary",
  /** 1px line — „გაუქმება“ */
  Secondary = "secondary",
  /** ჩარჩოს გარეშე — „Excel-ში გახსნა ↗“ */
  Text = "text",
  /** 1px ink — „თავიდან ცდა“ */
  Outline = "outline",
  /** მინა — ლენდინგი „დემოს ნახვა“ */
  Glass = "glass",
  /** გამჭვირვალე, hover-ზე მინა — ზოლის ბმული „შესვლა“ */
  Ghost = "ghost",
}

export enum ButtonSize {
  /** 36px · r10 · 14px — ზოლის ბმული */
  Sm = "sm",
  /** 38px */
  Md = "md",
  /** 42px */
  Lg = "lg",
  /** 48px — ლენდინგი */
  Xl = "xl",
}

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** spinner + ღილაკი დაბლოკილია */
  loading?: boolean;
  fullWidth?: boolean;
  /** თუ არის, ღილაკი ბმულად (next/link) რენდერდება */
  href?: string;
  /** მონიშნული ნავიგაციის პუნქტი (aria-current="page") */
  active?: boolean;
  children: ReactNode;
}
