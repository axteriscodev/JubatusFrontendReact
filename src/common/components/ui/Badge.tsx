import React from 'react';

type BadgeBg = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  bg?: BadgeBg;
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ children, bg = 'primary', className = '', ...props }: BadgeProps) => {
  const bgClasses: Record<BadgeBg, string> = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-600 text-white',
    success: 'bg-green-600 text-white',
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgClasses[bg]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
