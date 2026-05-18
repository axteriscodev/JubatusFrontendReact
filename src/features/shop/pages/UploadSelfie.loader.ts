// Loader React Router per la pagina UploadSelfie.
// Recupera i dati dell'evento (configurazione, logo, lingua) prima del render della pagina.
import { getPreferredLanguage } from '@common/utils/language-utils';
import type { LoaderFunctionArgs } from 'react-router-dom';

export async function loader({ params }: LoaderFunctionArgs) {
  const eventName = params.eventSlug;
  const currentLanguage = getPreferredLanguage();

  const response = await fetch(
    import.meta.env.VITE_API_URL + `/contents/event-data/${eventName}/${currentLanguage.acronym}`
  );

  if (response.status === 404) {
    const body = await response.json().catch(() => null);
    throw { status: 404, active: body?.data?.active ?? null };
  }

  if (!response.ok) {
    throw new Response("Errore server", { status: response.status });
  }

  return response;
}
