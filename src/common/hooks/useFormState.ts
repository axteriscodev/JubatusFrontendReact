import { useState, type ChangeEvent } from 'react';

type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

/**
 * Hook per la gestione dello stato di un form generico.
 * handleChange aggiorna il campo corrispondente al name dell'input;
 * resetForm ripristina i valori iniziali.
 */
export function useFormState<T extends Record<string, unknown>>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);

  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setForm(initialForm);

  return { form, setForm, handleChange, resetForm };
}
