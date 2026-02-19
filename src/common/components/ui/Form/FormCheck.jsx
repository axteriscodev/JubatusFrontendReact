import React from 'react';

/**
 * FormCheck component - Checkbox/Radio
 */
const FormCheck = React.forwardRef(({
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
