export function formatDate(dateToFormat, locale) {
  const date = new Date(dateToFormat);

  const formattedDate = date.toLocaleDateString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedDate;
}
