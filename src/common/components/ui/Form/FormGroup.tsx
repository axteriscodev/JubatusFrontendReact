import React from 'react';

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  controlId?: string;
}

const FormGroup = ({ children, className = '', controlId: _controlId, ...props }: FormGroupProps) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default FormGroup;
