const flagOverrides: Record<string, string> = {
  en: "gb",
  it: "it",
  pt: "pt",
};

export function getFlagCode(langCode: string): string {
  return flagOverrides[langCode] ?? langCode;
}
