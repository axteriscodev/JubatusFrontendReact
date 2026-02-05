import { useState } from "react";

/**
 * Carousel component - Simple image carousel
 */
const Carousel = ({ children, activeIndex: controlledIndex, onSelect, className = "", ...props }) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const items = Array.isArray(children) ? children : [children];

  const handleSelect = (index) => {
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

const CarouselItem = ({ children, className = "", ...props }) => {
  return (
    <div className={`w-full ${className}`} {...props}>
      {children}
    </div>
  );
};

Carousel.Item = CarouselItem;

export default Carousel;
