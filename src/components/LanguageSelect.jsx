import { useLanguage } from "../features/LanguageContext";

export default function LanguageSelect({ onChange }) {
  const { currentLanguage, setLanguage, availableLanguages, loadingLanguages } = useLanguage();

  if (loadingLanguages) return null;

  const handleChange = (event) => {
    const lang = availableLanguages.find(l => l.acronym === event.target.value);
    if (lang) {
      setLanguage(lang);
      onChange?.(lang.acronym);
    }
  };

  return (
    <select
      value={currentLanguage.acronym}
      onChange={handleChange}
      className="p-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {availableLanguages.map(lang => (
        <option key={lang.acronym} value={lang.acronym}>
          {lang.language}
        </option>
      ))}
    </select>
  );
}
