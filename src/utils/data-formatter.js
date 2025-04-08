/**
 * Metodo per la formattazione delle date in base all'area geografica
 * @param {*} dateToFormat - La data da formattare
 * @param {*} locale - Il codice dell'area geografica
 * @returns - la data formattata
 */
export function formatDate(dateToFormat, locale) {
  const date = new Date(dateToFormat);

  const formattedDate = date.toLocaleDateString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedDate;
}
