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

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}
