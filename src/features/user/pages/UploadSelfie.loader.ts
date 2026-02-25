import { getPreferredLanguage } from '@common/utils/language-utils';
import type { LoaderFunctionArgs } from 'react-router-dom';

export async function loader({ params }: LoaderFunctionArgs) {
  const eventName = params.eventSlug;
  const currentLanguage = getPreferredLanguage();

  const response = await fetch(
    import.meta.env.VITE_API_URL + `/contents/event-data/${eventName}/${currentLanguage.acronym}`
  );

  if (!response.ok) {
    let message = "Si è verificato un errore o l'evento non è presente";

    if (response.status === 204) {
      message = "Nessun contenuto presente";
    }

    throw new Response(message, { status: response.status });
  } else {
    return response;
  }
}
