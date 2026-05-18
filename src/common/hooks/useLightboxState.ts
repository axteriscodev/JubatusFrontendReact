import { useState } from 'react';

interface LightboxState {
  open: boolean;
  select: boolean;
  actions: boolean;
  personalSlice: boolean;
  index: number;
  slides: unknown[];
}

const INITIAL_STATE: LightboxState = {
  open: false,
  select: false,
  actions: false,
  personalSlice: false,
  index: 0,
  slides: [],
};

/**
 * Hook per la gestione dello stato del lightbox gallery.
 * openLightbox apre il lightbox su uno slide specifico;
 * updateSlide permette di aggiornare un singolo slide (es. dopo toggle preferito).
 */
export function useLightboxState() {
  const [lightbox, setLightbox] = useState<LightboxState>(INITIAL_STATE);

  const openLightbox = (
    images: unknown[],
    startIndex = 0,
    select: boolean,
    actions: boolean,
    personalSlice = false,
  ) => {
    setLightbox({ open: true, slides: images, index: startIndex, select, actions, personalSlice });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, open: false }));
  };

  const setIndex = (index: number) => {
    setLightbox((prev) => ({ ...prev, index }));
  };

  const updateSlide = (i: number, updatedSlide: unknown) => {
    setLightbox((prev) => {
      const copy = [...prev.slides];
      copy[i] = updatedSlide;
      return { ...prev, slides: copy };
    });
  };

  return { lightbox, openLightbox, closeLightbox, setIndex, updateSlide };
}
