import styles from "./LandingAbout.module.scss";
import type { LandingAboutProps } from "./LandingAbout.types";

export function LandingAbout({ lead, paragraphs, features, className }: LandingAboutProps) {
  const cls = [styles.about, className].filter(Boolean).join(" ");

  return (
    <div className={cls}>
      <p className={styles.lead}>{lead}</p>
      {paragraphs.map((text) => (
        <p key={text} className={styles.text}>
          {text}
        </p>
      ))}
      <ul className={styles.list}>
        {features.map((item) => (
          <li key={item.title} className={styles.item}>
            <span aria-hidden="true" className={styles.icon}>
              {item.icon}
            </span>
            <span className={styles.body}>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.itemText}>{item.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
