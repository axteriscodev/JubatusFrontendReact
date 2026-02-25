import React, { useState, useEffect, useRef } from 'react';

export interface CollapseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'in'> {
  in: boolean;
  children: React.ReactNode;
  className?: string;
}

const Collapse = ({ in: isOpen, children, className = '', ...props }: CollapseProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);

  useEffect(() => {
    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight;
      setHeight(contentHeight ?? 'auto');
      setTimeout(() => setHeight('auto'), 300);
    } else {
      setHeight(contentRef.current?.scrollHeight ?? 0);
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
