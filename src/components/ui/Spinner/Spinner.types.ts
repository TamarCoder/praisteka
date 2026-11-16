export enum SpinnerTone {
  Mute = "mute",
  OnAccent = "onAccent",
}

export interface SpinnerProps {
  tone?: SpinnerTone;
  /** px, ნაგულისხმევი 14 */
  size?: number;
  label?: string;
  className?: string;
}
