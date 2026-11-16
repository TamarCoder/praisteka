export interface DropzoneProps {
  /** მაგ. „აირჩიე ფაილი ან ჩააგდე აქ“ ან არჩეული ფაილის სახელი */
  label: string;
  /** მაგ. „.xlsx · .xls“ */
  hint?: string;
  /** მაგ. ".xlsx,.xls" */
  accept?: string;
  onFile: (file: File) => void;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}
