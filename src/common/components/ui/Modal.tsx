import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  onHide: () => void;
  children: React.ReactNode;
  centered?: boolean;
  size?: ModalSize;
  backdrop?: boolean;
  keyboard?: boolean;
  className?: string;
}

interface ModalComponent extends React.FC<ModalProps> {
  Header: typeof ModalHeader;
  Title: typeof ModalTitle;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
}

const Modal: ModalComponent = ({
  show,
  onHide,
  children,
  centered = false,
  size = 'md',
  backdrop = true,
  keyboard = true,
  className = '',
  ...props
}) => {
  useEffect(() => {
    if (!show || !keyboard) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onHide();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [show, keyboard, onHide]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (backdrop && e.target === e.currentTarget) {
          onHide();
        }
      }}
    >
      {backdrop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      )}

      <div
        className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} ${
          centered ? 'my-auto' : 'my-8'
        } ${className}`}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  closeButton?: boolean;
  onHide?: () => void;
  className?: string;
}

const ModalHeader = ({ children, closeButton = true, onHide, className = '', ...props }: ModalHeaderProps) => {
  return (
    <div
      className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 ${className}`}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {closeButton && (
        <button
          onClick={onHide}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export interface ModalSubComponentProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

const ModalTitle = ({ children, className = '', ...props }: ModalSubComponentProps) => {
  return (
    <h3 className={`text-xl font-bold text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  );
};

const ModalBody = ({ children, className = '', ...props }: ModalSubComponentProps) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const ModalFooter = ({ children, className = '', ...props }: ModalSubComponentProps) => {
  return (
    <div
      className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
