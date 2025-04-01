export function setUiPreset(eventData) {
    document.documentElement.style.setProperty(
        "--bg-color",
        eventData.data.backgroundColor
      );
      document.documentElement.style.setProperty(
        "--font-color",
        eventData.data.color
      );
}