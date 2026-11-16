interface DateRange {
  /** "YYYY-MM-DD" ან "" */
  from: string;
  to: string;
}

interface DateRangeLabels {
  placeholder: string;
  clear: string;
  prev: string;
  next: string;
  /** 12 თვე */
  months: string[];
  /** 7 დღე, ორშაბათიდან */
  weekdays: string[];
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  /** ეკრანის წამკითხველისთვის */
  label: string;
  labels: DateRangeLabels;
  className?: string;
}
