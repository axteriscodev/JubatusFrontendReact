import { useState, useEffect, useRef } from 'react';

/**
 * Collapse component - Expandable/collapsible content
 */
const Collapse = ({ in: isOpen, children, className = '', ...props }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(isOpen ? 'auto' : 0);

  useEffect(() => {
    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight;
      setHeight(contentHeight);
      // After animation, set to auto for dynamic content
      setTimeout(() => setHeight('auto'), 300);
    } else {
      // Set explicit height before collapsing
      setHeight(contentRef.current?.scrollHeight);
      setTimeout(() => setHeight(0), 0);
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      className={`overflow-hidden transition-all duration-300 ${className}`}
      style={{ height: height === 'auto' ? 'auto' : `${height}px` }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Collapse;
