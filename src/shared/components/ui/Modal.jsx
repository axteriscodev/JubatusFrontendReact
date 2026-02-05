import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal component with Tailwind CSS styling
 * Replaces react-bootstrap Modal
 *
 * @param {Object} props
 * @param {boolean} props.show - Show/hide modal
 * @param {Function} props.onHide - Close handler
 * @param {React.ReactNode} props.children - Modal content
 * @param {boolean} props.centered - Center modal vertically
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.size - Modal size
 * @param {boolean} props.backdrop - Show backdrop (default: true)
 * @param {boolean} props.keyboard - Close on ESC key (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const Modal = ({
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
  // Handle ESC key
  useEffect(() => {
    if (!show || !keyboard) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onHide();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [show, keyboard, onHide]);

  // Lock body scroll when modal is open
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

  const sizeClasses = {
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
      {/* Backdrop */}
      {backdrop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      )}

      {/* Modal content */}
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

const ModalHeader = ({ children, closeButton = true, onHide, className = '', ...props }) => {
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

const ModalTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-xl font-bold text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  );
};

const ModalBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const ModalFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Export compound component
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
