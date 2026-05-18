import { getAuthToken } from "../utils/auth";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import type { ApiRequestParams } from "@/types/api";

/**
 * @deprecated - Metodo deprecato, usare apiRequest
 */
export async function sendRequest(
  api: string,
  method: string,
  body?: BodyInit,
): Promise<Response> {
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
 * Wrapper standard per le chiamate fetch all'API backend.
 * Gestisce automaticamente l'header Content-Type (omesso per FormData)
 * e aggiunge il token JWT se needAuth è true.
 */
export async function apiRequest({
  api,
  method = "GET",
  body,
  needAuth = false,
  contentType = "application/json",
}: ApiRequestParams): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers();

  if (!(body instanceof FormData)) {
    headers.append("Content-Type", contentType);
  }

  if (needAuth) {
    headers.append("Authorization", `Bearer ${token}`);
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
 * Apre una connessione Server-Sent Events verso l'URL indicato.
 * Restituisce una funzione di cleanup che chiude la connessione (abort).
 * Il token JWT viene incluso nell'header Authorization se presente.
 */
export function listenSSE(
  api: string,
  callbackMessage: (data: string) => void,
  callbackError: (err: unknown) => void,
): () => void {
  const controller = new AbortController();
  const token = getAuthToken();

  fetchEventSource(api, {
    signal: controller.signal,
    headers: {
      Accept: "text/event-stream",
      Authorization: token ? `Bearer ${token}` : "",
    },
    async onmessage(msg) {
      if (msg.event === "message" || !msg.event) {
        console.log("Dati ricevuti:", msg.data);
        callbackMessage(msg.data);
      }
    },
    onerror(err) {
      if ((err as Error)?.name === "AbortError") return;
      console.error("Errore SSE:", err);
      callbackError(err);
      throw err;
    },
  });

  return () => controller.abort();
}
