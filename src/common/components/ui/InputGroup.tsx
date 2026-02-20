import React from 'react';

export interface InputGroupTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

const InputGroupText = ({ children, className = '', ...props }: InputGroupTextProps) => {
  return (
    <span
      className={`inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

interface InputGroupComponent extends React.FC<InputGroupProps> {
  Text: typeof InputGroupText;
}

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const InputGroup: InputGroupComponent = ({ children, className = '', ...props }) => {
  return (
    <div className={`flex ${className}`} {...props}>
      {children}
    </div>
  );
};

InputGroup.Text = InputGroupText;

export default InputGroup;
