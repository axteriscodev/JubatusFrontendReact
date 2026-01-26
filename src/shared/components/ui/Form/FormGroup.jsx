import React from 'react';

/**
 * FormGroup component - Groups form elements
 */
const FormGroup = ({ children, className = '', controlId, ...props }) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default FormGroup;
