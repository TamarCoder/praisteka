import type { LandingFeature } from "../LandingFeatures/LandingFeatures.types";

export interface LandingAboutProps {
  /** მთავარი წინადადება, უფრო დიდი შრიფტით */
  lead: string;
  paragraphs: string[];
  features: LandingFeature[];
  className?: string;
}
