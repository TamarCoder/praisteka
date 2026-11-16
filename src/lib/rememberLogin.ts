// "დამიმახსოვრე": ელფოსტა — localStorage-ში, პაროლი — ბრაუზერის პაროლების მენეჯერში (არა localStorage-ში)
const KEY = "priceteka-remember-email";

export function getRememberedEmail(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveLogin(remember: boolean, email: string, password: string): void {
  try {
    if (!remember) return localStorage.removeItem(KEY);
    localStorage.setItem(KEY, email);
  } catch {
    // private mode — ელფოსტა არ შეინახება
  }
  const Credential = (window as Window & { PasswordCredential?: new (data: { id: string; password: string }) => Credential }).PasswordCredential;
  if (Credential) navigator.credentials.store(new Credential({ id: email, password })).catch(() => {});
}
