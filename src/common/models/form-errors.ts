/** Mappa degli errori di validazione del form principale (selfie, email, pin, privacy). */
export interface FormErrors {
  imageError: boolean;
  emailError: boolean;
  emailNotPresent: boolean;
  pinError: boolean;
  privacyError: boolean;
  emailDuplicated?: boolean;
}

/** Crea un oggetto FormErrors con tutti i campi a false, con override opzionali. */
export function createFormErrors(overrides: Partial<FormErrors> = {}): FormErrors {
  return {
    imageError: false,
    emailError: false,
    emailNotPresent: false,
    pinError: false,
    privacyError: false,
    ...overrides,
  };
}
