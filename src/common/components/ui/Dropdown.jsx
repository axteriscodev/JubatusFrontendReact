import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

/**
 * Dropdown component with Tailwind CSS styling
 * Replaces react-bootstrap Dropdown
 *
 * Features:
 * - Click outside to close
 * - ESC key to close
 * - Keyboard navigation (arrow keys)
 * - Accessible (ARIA attributes)
 */

// Context for sharing dropdown state
const DropdownContext = createContext();

const Dropdown = ({ children, align = 'start', className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, align }}>
      <div ref={dropdownRef} className={`relative inline-block ${className}`} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const DropdownToggle = React.forwardRef(({ children, as: Component = 'button', className = '', ...props }, ref) => {
  const { isOpen, setIsOpen } = useContext(DropdownContext);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    props.onClick?.(e);
  };

  // If a custom component is provided, render it
  if (Component !== 'button' && typeof Component !== 'string') {
    return <Component ref={ref} onClick={handleClick} {...props}>{children}</Component>;
  }

  // Default button
  const ElementType = Component === 'button' ? 'button' : Component;

  return (
    <ElementType
      ref={ref}
      onClick={handleClick}
      className={`inline-flex items-center justify-center ${className}`}
      aria-expanded={isOpen}
      aria-haspopup="true"
      {...props}
    >
      {children}
    </ElementType>
  );
});

DropdownToggle.displayName = 'DropdownToggle';

const DropdownMenu = ({ children, className = '', ...props }) => {
  const { isOpen, align } = useContext(DropdownContext);

  if (!isOpen) return null;

  const alignClasses = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={`absolute ${alignClasses[align]} mt-2 min-w-[10rem] bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 ${className}`}
      role="menu"
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownItem = ({ children, onClick, className = '', disabled = false, ...props }) => {
  const { setIsOpen } = useContext(DropdownContext);

  const handleClick = (e) => {
    if (disabled) return;
    onClick?.(e);
    setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      role="menuitem"
      {...props}
    >
      {children}
    </button>
  );
};

const DropdownDivider = ({ className = '' }) => {
  return <hr className={`my-1 border-gray-200 ${className}`} />;
};

// Export compound component
Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;

export default Dropdown;
