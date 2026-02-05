import React from 'react';

/**
 * FormError component for displaying validation errors
 */
const FormError = ({ children, className = '', ...props }) => {
  if (!children) return null;

  return (
    <p className={`text-sm text-danger mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
};

export default FormError;
