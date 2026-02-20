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

export async function listenSSE(
  api: string,
  callbackMessage: (data: string) => void,
  callbackError: (err: unknown) => void,
): Promise<void> {
  const token = getAuthToken();
  const headers = {
    Accept: "text/event-stream",
    Authorization: token ? `Bearer ${token}` : "",
  };

  await fetchEventSource(api, {
    headers: headers,
    async onmessage(msg) {
      if (msg.event === "message" || !msg.event) {
        console.log("Dati ricevuti:", msg.data);
        callbackMessage(msg.data);
      }
    },
    onerror(err) {
      console.error("Errore SSE:", err);
      callbackError(err);
      throw err;
    },
  });
}
