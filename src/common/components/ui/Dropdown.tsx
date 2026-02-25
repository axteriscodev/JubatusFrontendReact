import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

type DropdownAlign = 'start' | 'end' | 'center';

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  align: DropdownAlign;
}

const DropdownContext = createContext<DropdownContextValue>({
  isOpen: false,
  setIsOpen: () => undefined,
  align: 'start',
});

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: DropdownAlign;
  className?: string;
}

interface DropdownComponent extends React.FC<DropdownProps> {
  Toggle: typeof DropdownToggle;
  Menu: typeof DropdownMenu;
  Item: typeof DropdownItem;
  Divider: typeof DropdownDivider;
}

const Dropdown: DropdownComponent = ({ children, align = 'start', className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
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

export interface DropdownToggleProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
}

const DropdownToggle = React.forwardRef<HTMLElement, DropdownToggleProps>(
  ({ children, as: Component = 'button', className = '', ...props }, ref) => {
    const { isOpen, setIsOpen } = useContext(DropdownContext);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
      (props.onClick as React.MouseEventHandler<HTMLElement> | undefined)?.(e);
    };

    if (Component !== 'button' && typeof Component !== 'string') {
      return <Component ref={ref} onClick={handleClick} {...props}>{children}</Component>;
    }

    const ElementType = Component as React.ElementType;

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
  }
);

DropdownToggle.displayName = 'DropdownToggle';

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenu = ({ children, className = '', ...props }: DropdownMenuProps) => {
  const { isOpen, align } = useContext(DropdownContext);

  if (!isOpen) return null;

  const alignClasses: Record<DropdownAlign, string> = {
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

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const DropdownItem = ({ children, onClick, className = '', disabled = false, ...props }: DropdownItemProps) => {
  const { setIsOpen } = useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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

export interface DropdownDividerProps {
  className?: string;
}

const DropdownDivider = ({ className = '' }: DropdownDividerProps) => {
  return <hr className={`my-1 border-gray-200 ${className}`} />;
};

Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;

export default Dropdown;
