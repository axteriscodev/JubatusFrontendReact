import React from "react";

/**
 * FormLabel component with Tailwind CSS styling
 * Replaces react-bootstrap Form.Label
 */
const FormLabel = ({
  children,
  htmlFor,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`form-label block text-md secondary-event-color mb-1 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-danger ml-1">*</span>}
    </label>
  );
};

export default FormLabel;
