import React from 'react';
import FormLabel from './FormLabel';
import FormError from './FormError';
import Input from '../Input';

/**
 * FormField component - combines Label, Input, and Error
 * Provides a complete form field with validation
 */
const FormField = ({
  label,
  error,
  required = false,
  id,
  name,
  className = '',
  ...inputProps
}) => {
  const fieldId = id || name;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <FormLabel htmlFor={fieldId} required={required}>
          {label}
        </FormLabel>
      )}
      <Input
        id={fieldId}
        name={name}
        error={!!error}
        {...inputProps}
      />
      <FormError>{error}</FormError>
    </div>
  );
};

export default FormField;
