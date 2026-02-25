import React from 'react';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

const FormLabel = ({
  children,
  htmlFor,
  required = false,
  className = "",
  ...props
}: FormLabelProps) => {
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
