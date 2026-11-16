import { Input } from "@/components/ui/Input/Input";
import { InputVariant } from "@/components/ui/Input/Input.types";
import styles from "./FileHeader.module.scss";
import type { FileHeaderProps } from "./FileHeader.types";

// მარცხნივ: ძებნა · მარჯვნივ: ღილაკები · ქვემოთ ხაზი
export function FileHeader({ query, onQueryChange, placeholder, searchLabel, disabled, actions, scope }: FileHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.start}>
        <Input
          type="search"
          variant={InputVariant.Search}
          className={styles.search}
          value={query}
          placeholder={placeholder}
          aria-label={searchLabel}
          disabled={disabled}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {scope}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
