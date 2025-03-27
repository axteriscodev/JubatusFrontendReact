import { getAuthToken } from '../utils/auth';

export async function sendRequest(api, method, body) {
  const token = getAuthToken();

  const response = await fetch(api, {
    method: method,
    body: body,
    headers: {
      Authorization : 'Bearer ' + token
    }
  });

  if (!response.ok) {
    console.error("Errore nella richiesta");
  } else {
    console.log("Richiesta ok");
  }
  return response;
}

export function listenSSE(api, onmessage, onerror) {
  const sse = new EventSource(api);

  sse.onmessage = (e) => {
    console.log(e.data);
    sse.close();
    onmessage(e);
  };
  sse.onerror = (e) => {
    console.log("Errore!");
    sse.close();
    onerror(e);
  };
}
