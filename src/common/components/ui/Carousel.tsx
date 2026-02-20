import React, { useState } from "react";

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const CarouselItem = ({ children, className = "", ...props }: CarouselItemProps) => {
  return (
    <div className={`w-full ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CarouselComponent extends React.FC<CarouselProps> {
  Item: typeof CarouselItem;
}

export interface CarouselProps {
  children: React.ReactNode;
  activeIndex?: number;
  onSelect?: (index: number) => void;
  className?: string;
}

const Carousel: CarouselComponent = ({ children, activeIndex: controlledIndex, onSelect, className = "", ...props }) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const items = Array.isArray(children) ? children : [children];

  const handleSelect = (index: number) => {
    if (controlledIndex === undefined) {
      setInternalIndex(index);
    }
    onSelect?.(index);
  };

  return (
    <div className={`relative ${className}`} {...props}>
      {items[activeIndex]}

      {/* Navigation buttons */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => handleSelect((activeIndex - 1 + items.length) % items.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            ‹
          </button>
          <button
            onClick={() => handleSelect((activeIndex + 1) % items.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

Carousel.Item = CarouselItem;

export default Carousel;
