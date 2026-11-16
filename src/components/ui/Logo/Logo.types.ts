export enum LogoSize {
  /** 30px — ლენდინგის ზოლი */
  Sm = "sm",
  /** 34px — აპის გვერდითი ზოლი */
  Md = "md",
  /** 40px — ავტორიზაცია */
  Lg = "lg",
}

export interface LogoProps {
  size?: LogoSize;
  /** ნიშნის გვერდით „პრაისთეკა“ */
  withText?: boolean;
  className?: string;
}
