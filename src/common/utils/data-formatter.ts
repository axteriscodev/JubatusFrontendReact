export function formatDate(dateToFormat: string | number | Date, locale: string): string {
  const date = new Date(dateToFormat);
  return date.toLocaleDateString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrencyPrice(
  price: number | string,
  currency: string,
  symbol: string,
): string {
  return currency === "EUR" ? `${price} ${symbol}` : `${symbol} ${price}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}
