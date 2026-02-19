import { jwtDecode } from "jwt-decode";

/**
 * Utility per la gestione dell'autenticazione
 */

/**
 * Metodo per il recupero del token
 * @returns
 */
export function getAuthToken() {
  const token = localStorage.getItem("jwt");
  return token;
}

/**
 * Metodo per impostare il token
 * @param {*} token - il token jwt da salvare
 */
export function setAuthToken(token) {
  localStorage.setItem("jwt", token);
}

/**
 * Metodo per l'inserimento del livello utente
 * @param {*} level - il livello utente
 */
export function setLevel(level) {
  localStorage.setItem("level", level);
}

/**
 * Metodo per il recupero del livello dell'utente
 * @returns - il livello dell'utente
 */
export function getLevel() {
  const level = localStorage.getItem("level");
  return level;
}

// export function checkAuthLoader() {
//   const token = getAuthToken();

//   if (!isValid(token)) {
//     logOut();
//     return redirect("/");
//   }

//   return null;
// }

/**
 * Metodo per la verifica dell'autenticazione
 *
 * @returns true se l'utente è autenticato, false altrimenti
 */
export function isAuthenticated() {
  const token = getAuthToken();
  const result = isValid(token);
  return result;
}

/**
 * Verifica se l'utente ha diritti di amministrazione
 *
 * @returns true se l'utente è un admin, false altrimenti
 */
export function isAdmin() {
  const token = getAuthToken();
  const level = getLevel();
  const result = isValid(token) && level !== null && parseInt(level) !== 3;
  return result;
}

/**
 * Metodo per il logout dell'utente, con relativa cancellazione dei parametri
 */
export function logOut() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("level");
}

/**
 * Metodo interno per la verifica della validità del token
 *
 * @param {*} token - il token jwt da verificare
 * @returns - true se il token è valido, false altrimenti
 */
function isValid(token) {
  //verifica se il token è presente
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    //Controllo se il token è scaduto
    return decodedToken.exp > currentTime;
  } catch (error) {
    // Il token non è valido
    console.error("Errore durante la decodifica del token", error);
    return false;
  }
}
