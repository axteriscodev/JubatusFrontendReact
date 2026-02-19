import { useState, useCallback } from "react";

/**
 * Campi obbligatori per il form evento
 */
const REQUIRED_FIELDS = {
  title: "Titolo evento",
  pathS3: "Path S3",
  tagId: "Tipologia evento",
  currencyId: "Valuta",
  dateEvent: "Data evento",
  dateStart: "Data pubblicazione",
  dateExpiry: "Data scadenza",
};

/**
 * Hook per la validazione del form evento
 */
export function useFormValidation() {
  const [errors, setErrors] = useState({});

  /**
   * Valida il form e restituisce true se valido, false altrimenti
   */
  const validateForm = useCallback((formData) => {
    const newErrors = {};

    Object.entries(REQUIRED_FIELDS).forEach(([field, label]) => {
      const value = formData[field];
      // Considera vuoto: stringa vuota, null, undefined, 0 (per i select con value numerico)
      if (value === "" || value === null || value === undefined || value === 0) {
        newErrors[field] = `${label} è obbligatorio`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  /**
   * Rimuove l'errore per un campo specifico (utile quando l'utente corregge)
   */
  const clearFieldError = useCallback((fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Resetta tutti gli errori
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Restituisce la lista dei nomi dei campi con errori
   */
  const getErrorMessages = useCallback(() => {
    return Object.values(errors);
  }, [errors]);

  return {
    errors,
    validateForm,
    clearFieldError,
    clearAllErrors,
    getErrorMessages,
  };
}
