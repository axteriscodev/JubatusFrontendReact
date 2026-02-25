import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fluid?: boolean;
  className?: string;
}

const Container = ({ children, fluid = false, className = '', ...props }: ContainerProps) => {
  return (
    <div
      className={`${fluid ? 'w-full' : 'container mx-auto px-4'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
