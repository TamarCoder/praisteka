interface ScenePriceRow {
  service: string;
  price: string;
}

export interface ScenePricePlateProps {
  /** ძებნის ველში ჩაწერილი ტექსტი */
  query: string;
  serviceHeader: string;
  priceHeader: string;
  /** პირველი სტრიქონი მონიშნულია */
  rows: ScenePriceRow[];
  className?: string;
}
