import type { ReactNode } from "react";

// ცარიელი მდგომარეობების ხატულები (ფაილები, ისტორია); ფერი — currentColor (EmptyState-იდან)
const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const StateIcon = {
  /** Excel ცხრილი ისრით ზემოთ — ატვირთვა */
  upload: icon(
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <path d="M12 18v-6M9 15l3-3 3 3" />
    </>,
  ),
  /** საქაღალდე — ცარიელი სია */
  folder: icon(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />),
  /** საათი ისრით — ისტორია */
  history: icon(
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3 2" />
    </>,
  ),
  /** ძაბრი — ფილტრი */
  filter: icon(<path d="M3 5h18l-7 8v6l-4 2v-8z" />),
  /** სია და მაჩვენებელი — აირჩიე */
  pick: icon(
    <>
      <path d="M9 6h11M9 12h11M9 18h6" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </>,
  ),
  /** გაფრთხილება */
  error: icon(
    <>
      <path d="M12 3 2 20h20z" />
      <path d="M12 10v4M12 17h.01" />
    </>,
  ),
  /** დროშა — პირველი ვერსია */
  first: icon(
    <>
      <path d="M5 21V4" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </>,
  ),
  /** ნიშანი — ცვლილება არ არის */
  same: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>,
  ),
};
