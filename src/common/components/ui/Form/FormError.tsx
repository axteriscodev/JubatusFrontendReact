import React from 'react';

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
}

const FormError = ({ children, className = '', ...props }: FormErrorProps) => {
  if (!children) return null;

  return (
    <p className={`text-sm text-danger mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
};

export default FormError;
