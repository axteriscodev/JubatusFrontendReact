import React from 'react';

/**
 * FormControl component - Input wrapper compatible with Bootstrap API
 */
const FormControl = React.forwardRef(({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  isInvalid = false,
  isValid = false,
  className = '',
  name,
  as,
  rows,
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-event/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const stateClasses = isInvalid
    ? 'border-danger text-danger focus:border-danger'
    : isValid
    ? 'border-success focus:border-success'
    : 'border-gray-300 focus:border-secondary-event';

  const inputClasses = `${baseClasses} ${stateClasses} ${className}`;

  // If 'as' is textarea, render textarea
  if (as === 'textarea') {
    return (
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        rows={rows || 3}
        className={inputClasses}
        {...props}
      />
    );
  }

  // Default input
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
      className={inputClasses}
      {...props}
    />
  );
});

FormControl.displayName = 'FormControl';

// Add Feedback sub-component
const FormControlFeedback = ({ children, type = 'invalid', className = '', ...props }) => {
  const typeClasses = type === 'invalid' ? 'text-danger' : 'text-success';

  return (
    <div className={`text-sm mt-1 ${typeClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

FormControl.Feedback = FormControlFeedback;

export default FormControl;
