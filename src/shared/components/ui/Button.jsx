import React from 'react';

/**
 * Button component with Tailwind CSS styling
 * Replaces react-bootstrap Button
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'success' | 'danger' | 'link' | 'outline'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Button type attribute
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex gap-2 items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary text-bg text-white border-3 border-primary hover:bg-secondary-event hover:border-secondary-event rounded-full',
    secondary: 'bg-secondary text-white border-3 border-secondary hover:bg-secondary-event/90 rounded-full',
    success: 'bg-green-500 text-white border-3 border-success hover:bg-green-500/90 rounded-full',
    danger: 'bg-red-500 text-white border-3 border-danger hover:bg-red-500/90 rounded-full',
    link: 'text-secondary-event hover:text-secondary-event/80 underline bg-transparent border-0',
    outline: 'bg-transparent text-primary border-2 border-primary hover:bg-red-500 hover:text-white rounded-full',
  };

  // Size-specific classes
  const sizeClasses = {
    sm: 'text-sm px-4 py-1',
    md: 'text-xl px-5 py-1.5',
    lg: 'text-2xl px-6 py-2',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
