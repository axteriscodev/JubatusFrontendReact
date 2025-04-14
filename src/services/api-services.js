import { getAuthToken } from "../utils/auth";

/**
 * @deprecated - Metodo deprecato, usare apiRequest
 *
 * @param {*} api - URL dell'API
 * @param {*} method - metodo di richiesta (GET, POST, PUT, DELETE)
 * @param {*} body - body della richiesta
 * @returns
 */
export async function sendRequest(api, method, body) {
  const token = getAuthToken();

  const response = await fetch(api, {
    method: method,
    body: body,
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    console.error("Errore nella richiesta");
  } else {
    console.log("Richiesta ok");
  }
  return response;
}

/**
 * Metodo per invio richieste API
 *
 * @param {*} api - endpoint api
 * @param {*} method - metodo di richiesta (GET, POST, PUT, DELETE)
 * @param {*} body - body della richiesta
 * @param {*} needAuth - se la richiesta necessita di autenticazione
 * @param {*} contentType - tipo di contenuto della richiesta
 * @returns
 */
export async function apiRequest({
  api,
  method = "GET",
  body,
  needAuth = false,
  contentType = "application/json",
}) {
  const token = getAuthToken();
  const headers = new Headers();

  if (!(body instanceof FormData)) {
    headers.append('Content-Type', contentType);
  }

  if (needAuth) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(api, {
    method: method,
    body: body,
    headers: headers,
  });

  if (!response.ok) {
    console.error("Errore nella richiesta");
  } else {
    console.log("Richiesta ok");
  }
  return response;
}

/**
 * Metodo per ascolto di eventi SSE
 * @param {*} api - URL dell'API
 * @param {*} onmessage - funzione di callback per la ricezione dei messaggi
 * @param {*} onerror - funzione di callback per la gestione degli errori
 */
export function listenSSE(api, onmessage, onerror) {
  const sse = new EventSource(api);

  sse.onmessage = (e) => {
    console.log(e.data);
    sse.close();
    onmessage(e.data);
  };
  sse.onerror = (e) => {
    console.log("Errore!");
    sse.close();
    onerror(e);
  };
}
