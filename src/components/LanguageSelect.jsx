import React, { useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
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
            className="btn btn-link p-2 border-0 text-decoration-none d-inline-flex align-items-center"
            style={{
                backgroundColor: 'transparent',
                borderRadius: '0.375rem',
                transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e5e5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
            <div className="pe-3 d-inline-flex align-items-center">
                <img 
                    src={`https://flagcdn.com/h40/${getFlagCode(selected.acronym)}.png`} 
                    alt="" 
                    style={{
                        maxWidth: '24px',
                        height: '16px',
                        borderRadius: '0.125rem'
                    }}
                />
            </div>
            <span className="visually-hidden">Change language</span>
            <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                className="ms-1"
            >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </button>
    ));

    return (
        <Dropdown align="end">
            <Dropdown.Toggle as={CustomToggle} id="language-dropdown">
            </Dropdown.Toggle>

            <Dropdown.Menu 
                className="shadow-lg border-0"
                style={{
                    borderRadius: '0.375rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                }}
            >
                {availableLanguages
                    .map((lang) => (
                        <Dropdown.Item
                            key={lang.languageId}
                            onClick={() => handleChange(lang)}
                            className="px-3 py-2"
                            style={{
                                fontSize: '0.875rem',
                                cursor: 'pointer'
                            }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <img 
                                    src={`https://flagcdn.com/h40/${getFlagCode(lang.acronym)}.png`} 
                                    alt="" 
                                    style={{
                                        maxWidth: '24px',
                                        height: '16px',
                                        borderRadius: '0.125rem'
                                    }}
                                />
                                <span className={`${selected.acronym === lang.acronym ? 'fw-semibold' : 'fw-normal'}`}>
                                    {lang.language}
                                </span>
                                {selected.acronym === lang.acronym && (
                                    <svg
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                        className="text-primary ms-auto"
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