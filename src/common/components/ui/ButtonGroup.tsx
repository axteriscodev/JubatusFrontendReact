import React from 'react';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const ButtonGroup = ({ children, className = "", ...props }: ButtonGroupProps) => {
  return (
    <div className={`button-group isolate inline-flex ${className}`} {...props}>
      {children}
    </div>
  );
};

export default ButtonGroup;
