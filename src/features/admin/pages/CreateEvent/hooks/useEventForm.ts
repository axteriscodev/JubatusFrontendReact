import { useState, useEffect } from 'react';
import { slugify } from '@common/utils/data-formatter';
import { getInitialFormData, type EventFormData } from '../utils/eventFormHelpers';
import type { Competition } from '@/types/competition';

interface UseEventFormReturn {
  formData: EventFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateField: (name: keyof EventFormData, value: EventFormData[keyof EventFormData]) => void;
  resetForm: () => void;
}

export function useEventForm(receivedComp: Competition | null): UseEventFormReturn {
  const [formData, setFormData] = useState<EventFormData>(() => getInitialFormData(receivedComp));

  useEffect(() => {
    if (receivedComp) {
      setFormData(getInitialFormData(receivedComp));
    }
  }, [receivedComp]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const newSlug = slugify(newTitle);

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: newSlug,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };

  const updateField = (name: keyof EventFormData, value: EventFormData[keyof EventFormData]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(getInitialFormData(receivedComp));
  };

  return {
    formData,
    handleInputChange,
    handleTitleChange,
    handleFileChange,
    updateField,
    resetForm,
  };
}
