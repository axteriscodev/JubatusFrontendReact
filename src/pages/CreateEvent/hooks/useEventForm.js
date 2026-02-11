
import { useState, useEffect } from "react";
import { slugify } from "../../../utils/data-formatter";
import { getInitialFormData } from "../utils/eventFormHelpers";

/**
 * Hook personalizzato per gestire lo stato e la logica del form evento
 */
export function useEventForm(receivedComp) {
  const [formData, setFormData] = useState(getInitialFormData(receivedComp));

  useEffect(() => {
    if (receivedComp) {
      setFormData(getInitialFormData(receivedComp));
    }
  }, [receivedComp]);

  /**
   * Gestisce il cambio di un campo generico del form
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Gestisce il cambio del titolo e aggiorna automaticamente lo slug
   */
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const newSlug = slugify(newTitle);

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: newSlug,
    }));
  };

  /**
   * Gestisce il caricamento di un file (logo)
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };

  /**
   * Aggiorna un singolo campo del form
   */
  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Reset del form ai valori iniziali
   */
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