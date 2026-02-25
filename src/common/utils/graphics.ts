import type { Competition } from "@/types/competition";

export function setUiPreset(eventData: Pick<Competition, "backgroundColor" | "primaryColor" | "secondaryColor">): void {
  document.documentElement.style.setProperty("--bg-event-color", eventData.backgroundColor);
  document.documentElement.style.setProperty("--font-button-event-color", eventData.backgroundColor);
  document.documentElement.style.setProperty("--primary-event-color", eventData.primaryColor);
  document.documentElement.style.setProperty("--secondary-event-color", eventData.secondaryColor);
}

export function setHeaderData(eventData: Pick<Competition, "languages">): void {
  //da ripristinare quando passerà la favicon
  // let link = document.querySelector("link[rel='icon']");
  // link.href = eventData.faviconUrl;

  document.title = eventData.languages[0].title;
}

export function resetHeaderData(): void {
  document.title = "My Memories";
}
