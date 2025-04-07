import { redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function getAuthToken() {
  const token = localStorage.getItem("jwt");
  return token;
}

export function setAuthToken(token) {
  localStorage.setItem("jwt", token);
}

export function setLevel(level) {
  localStorage.setItem("level", level);
}

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

export function isAuthenticated() {
  const token = getAuthToken();
  return isValid(token);
}

export function isAdmin() {
  const token = getAuthToken();
  const level = getLevel();
  return isValid(token) && level !== null && level <= "1";
}

export function logOut() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("level");
}

function isValid(token) {
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
