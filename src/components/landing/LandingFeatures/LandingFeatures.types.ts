export interface LandingFeature {
  /** ერთი სიმბოლო, მაგ. „⬆“ */
  icon: string;
  title: string;
  text: string;
}

export interface LandingFeaturesProps {
  items: LandingFeature[];
  className?: string;
}
