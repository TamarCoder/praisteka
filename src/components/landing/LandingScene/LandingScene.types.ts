import type { ReactNode } from "react";

export interface LandingSceneProps {
  /** ფირფიტები ქვემოდან ზემოთ; თითო translateZ-ით მაღლა დგება */
  plates: ReactNode[];
  /** მაუსზე დახრა */
  tilt?: boolean;
  className?: string;
}
