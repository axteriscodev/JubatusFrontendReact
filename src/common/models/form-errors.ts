export interface FormErrors {
  imageError: boolean;
  emailError: boolean;
  emailNotPresent: boolean;
  pinError: boolean;
  privacyError: boolean;
  emailDuplicated?: boolean;
}

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
