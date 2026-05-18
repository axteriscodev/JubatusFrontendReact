import type { Competition } from "@/types/competition";

/** Applica i colori dell'evento come variabili CSS sul documento (tema dinamico per evento). */
export function setUiPreset(eventData: Pick<Competition, "backgroundColor" | "primaryColor" | "secondaryColor">): void {
  document.documentElement.style.setProperty("--bg-event-color", eventData.backgroundColor);
  document.documentElement.style.setProperty("--font-button-event-color", eventData.backgroundColor);
  document.documentElement.style.setProperty("--primary-event-color", eventData.primaryColor);
  document.documentElement.style.setProperty("--secondary-event-color", eventData.secondaryColor);
}

/** Imposta il titolo del tab del browser con il nome dell'evento (prima lingua disponibile). */
export function setHeaderData(eventData: Pick<Competition, "languages">): void {
  //da ripristinare quando passerà la favicon
  // let link = document.querySelector("link[rel='icon']");
  // link.href = eventData.faviconUrl;

  document.title = eventData.languages[0].title;
}

/** Ripristina il titolo del browser al valore di default "My Memories". */
export function resetHeaderData(): void {
  document.title = "My Memories";
}
