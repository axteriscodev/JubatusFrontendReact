import { useState, type ChangeEvent } from 'react';

type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export function useFormState<T extends Record<string, unknown>>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);

  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setForm(initialForm);

  return { form, setForm, handleChange, resetForm };
}
