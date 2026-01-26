import React, { useEffect } from 'react';
import Dropdown from '../shared/components/ui/Dropdown';
import { useLanguage } from "../features/LanguageContext";
import { getFlagCode } from "../utils/flag-utils";

export default function LanguageSelect({ onChange }) {
    const { currentLanguage, setLanguage, availableLanguages, loadingLanguages } = useLanguage();

    const selected = availableLanguages.find(
        (l) => l.acronym === currentLanguage.acronym
    ) ?? currentLanguage;

    const handleChange = (lang) => {
        setLanguage(lang);
        onChange?.(lang.acronym);
    };

    // Aggiorno attributo lang del tag html al cambio lingua
    useEffect(() => {
        if (currentLanguage.acronym) {
            document.documentElement.lang = currentLanguage.acronym;
        }
    }, [currentLanguage]);

    // Se sto leggendo le lingue disponibili non mostro nulla
    if (loadingLanguages) return null;

    // Custom toggle component per avere lo stesso styling
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <button
            ref={ref}
            onClick={onClick}
            className="p-2 border-0 no-underline inline-flex items-center bg-transparent rounded-md transition-colors duration-150 hover:bg-gray-200"
        >
            <div className="pr-3 inline-flex items-center">
                <img
                    src={`https://flagcdn.com/h40/${getFlagCode(selected.acronym)}.png`}
                    alt=""
                    className="max-w-6 h-4 rounded-sm"
                />
            </div>
            <span className="sr-only">Change language</span>
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ml-1"
            >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </button>
    ));

    return (
        <Dropdown align="end">
            <Dropdown.Toggle as={CustomToggle} id="language-dropdown">
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {availableLanguages
                    .map((lang) => (
                        <Dropdown.Item
                            key={lang.languageId}
                            onClick={() => handleChange(lang)}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={`https://flagcdn.com/h40/${getFlagCode(lang.acronym)}.png`}
                                    alt=""
                                    className="max-w-6 h-4 rounded-sm"
                                />
                                <span className={selected.acronym === lang.acronym ? 'font-semibold' : 'font-normal'}>
                                    {lang.language}
                                </span>
                                {selected.acronym === lang.acronym && (
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="text-blue-600 ml-auto"
                                    >
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </Dropdown.Item>
                    ))
                }
            </Dropdown.Menu>
        </Dropdown>
    );
}