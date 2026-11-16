export interface ToastProps {
  /** null ან ცარიელი — დამალულია */
  message: string | null;
  /** გამოიძახება duration-ის შემდეგ */
  onClose: () => void;
  /** ms, ნაგულისხმევი 2200 */
  duration?: number;
  className?: string;
}
