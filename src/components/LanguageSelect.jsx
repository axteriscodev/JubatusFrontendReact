import { useLanguage } from "../features/LanguageContext";
import Form from "react-bootstrap/Form";

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
    <Form.Select
      value={currentLanguage.acronym}
      onChange={handleChange}
    >
      {availableLanguages.map(lang => (
        <option key={lang.acronym} value={lang.acronym}>
          {lang.language}
        </option>
      ))}
    </Form.Select>
  );
}
