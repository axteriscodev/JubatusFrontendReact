import { jwtDecode } from "jwt-decode";

export function getAuthToken(): string | null {
  return localStorage.getItem("jwt");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("jwt", token);
}

export function setLevel(level: string | number): void {
  localStorage.setItem("level", String(level));
}

export function getLevel(): string | null {
  return localStorage.getItem("level");
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return isValid(token);
}

export function isAdmin(): boolean {
  const token = getAuthToken();
  const level = getLevel();
  return isValid(token) && level !== null && parseInt(level, 10) !== 3;
}

export function logOut(): void {
  localStorage.removeItem("jwt");
  localStorage.removeItem("level");
}

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
