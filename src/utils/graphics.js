export function setUiPreset(eventData) {
    document.documentElement.style.setProperty(
        "--bg-color",
        eventData.backgroundColor
      );
      document.documentElement.style.setProperty(
        "--font-color",
        eventData.primaryColor
      );
}