import React from 'react';

/**
 * FormSelect component - Select dropdown
 */
const FormSelect = React.forwardRef(({
  value,
  onChange,
  disabled = false,
  isInvalid = false,
  className = '',
  name,
  children,
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-event/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const stateClasses = isInvalid
    ? 'border-red-500 text-red-500 focus:border-red-500'
    : 'border-gray-300 focus:border-secondary-event';

  const selectClasses = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <select
      ref={ref}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
      className={selectClasses}
      {...props}
    >
      {children}
    </select>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormSelect;
