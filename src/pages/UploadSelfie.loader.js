/**
 * Loader per caricare i dati dell'evento da visualizzare nella pagina
 *
 * @param {*} request
 * @param {String} params - i parametri passati all'url
 * @returns
 */
export async function loader({ request, params }) {
  const eventName = params.eventSlug;
  const userHash = params.userHash;

  const currentLanguage = JSON.parse(localStorage.getItem('preferred_lang')) || { acronym: 'it' };

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
