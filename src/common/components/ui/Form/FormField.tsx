import FormLabel from './FormLabel';
import FormError from './FormError';
import Input, { InputProps } from '../Input';

export interface FormFieldProps extends Omit<InputProps, 'error'> {
  label?: string;
  error?: string;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

const FormField = ({
  label,
  error,
  required = false,
  id,
  name,
  className = '',
  ...inputProps
}: FormFieldProps) => {
  const fieldId = id ?? name;

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
