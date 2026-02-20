import React from 'react';

export interface FormCheckProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: 'checkbox' | 'radio';
  id?: string;
  label?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  className?: string;
  name?: string;
}

const FormCheck = React.forwardRef<HTMLInputElement, FormCheckProps>(({
  type = 'checkbox',
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  name,
  ...props
}, ref) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
});

FormCheck.displayName = 'FormCheck';

export default FormCheck;
