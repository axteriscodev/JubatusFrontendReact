import { jwtDecode } from "jwt-decode";

/** Permessi e metadati del ruolo utente, salvati in localStorage come JSON. */
export interface UserRole {
  id: number;
  level: string;
  canViewOriginalContent: boolean;
  canViewExternalPayments: boolean;
  canManageExternalPayments: boolean;
  canManagePayments: boolean;
  canManageEvents: boolean;
  canManageAllEvents: boolean;
}

/** Restituisce il token JWT salvato in localStorage, o null se assente. */
export function getAuthToken(): string | null {
  return localStorage.getItem("jwt");
}

/** Salva il token JWT in localStorage. */
export function setAuthToken(token: string): void {
  localStorage.setItem("jwt", token);
}

/** Salva il livello utente in localStorage (come stringa). */
export function setLevel(level: string | number): void {
  localStorage.setItem("level", String(level));
}

/** Restituisce il livello utente da localStorage, o null se assente. */
export function getLevel(): string | null {
  return localStorage.getItem("level");
}

/** Restituisce true se l'utente ha un token JWT valido e non scaduto. */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return isValid(token);
}

/** Restituisce true se l'utente è autenticato e ha un livello diverso da 3 (livello cliente). */
export function isAdmin(): boolean {
  const token = getAuthToken();
  const level = getLevel();
  return isValid(token) && level !== null && parseInt(level, 10) !== 3;
}

/** Salva il ruolo utente in localStorage come JSON. */
export function setRole(role: UserRole): void {
  localStorage.setItem("role", JSON.stringify(role));
}

/** Restituisce il ruolo utente da localStorage, o null se assente o malformato. */
export function getRole(): UserRole | null {
  const raw = localStorage.getItem("role");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserRole;
  } catch {
    return null;
  }
}

/** Rimuove token JWT, livello e ruolo da localStorage (logout completo). */
export function logOut(): void {
  localStorage.removeItem("jwt");
  localStorage.removeItem("level");
  localStorage.removeItem("role");
}

/**
 * Restituisce true se il primo organization dell'utente nel JWT
 * ha il flag organizationAdmin = true.
 */
export function isOrganizationAdmin(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<{
      user: { organizations: { organizationAdmin: boolean }[] };
    }>(token);
    return decoded.user.organizations[0]?.organizationAdmin === true;
  } catch {
    return false;
  }
}

/** Verifica che il token JWT non sia scaduto decodificando il campo exp. */
function isValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Errore durante la decodifica del token", error);
    return false;
  }
}
