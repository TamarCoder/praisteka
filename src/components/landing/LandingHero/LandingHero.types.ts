interface LandingAction {
  label: string;
  href: string;
}

export interface LandingHeroProps {
  title: string;
  text: string;
  /** „დაწყება“ */
  primaryAction: LandingAction;
  /** „დემოს ნახვა“ */
  secondaryAction: LandingAction;
  className?: string;
}
