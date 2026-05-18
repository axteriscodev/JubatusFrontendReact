import { useState, useCallback } from 'react';
import type { EventFormData } from '../utils/eventFormHelpers';

type RequiredField = keyof Pick<EventFormData, 'title' | 'tagId' | 'currencyId' | 'dateEvent' | 'dateStart' | 'dateExpiry'>;

// Mappa campo → label leggibile usata nei messaggi di errore mostrati all'utente
const REQUIRED_FIELDS: Record<RequiredField, string> = {
  title: 'Titolo evento',
  tagId: 'Tipologia evento',
  currencyId: 'Valuta',
  dateEvent: 'Data evento',
  dateStart: 'Data pubblicazione',
  dateExpiry: 'Data scadenza',
};

type FormErrors = Partial<Record<RequiredField, string>>;

interface UseFormValidationReturn {
  errors: FormErrors;
  validateForm: (formData: EventFormData) => boolean;
  clearFieldError: (fieldName: RequiredField) => void;
  clearAllErrors: () => void;
  getErrorMessages: () => string[];
}

export function useFormValidation(): UseFormValidationReturn {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = useCallback((formData: EventFormData): boolean => {
    const newErrors: FormErrors = {};

    (Object.entries(REQUIRED_FIELDS) as [RequiredField, string][]).forEach(([field, label]) => {
      const value = formData[field];
      if (value === '' || value === null || value === undefined || value === 0) {
        newErrors[field] = `${label} è obbligatorio`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearFieldError = useCallback((fieldName: RequiredField) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getErrorMessages = useCallback(() => {
    return Object.values(errors).filter((v): v is string => v !== undefined);
  }, [errors]);

  return {
    errors,
    validateForm,
    clearFieldError,
    clearAllErrors,
    getErrorMessages,
  };
}
