import React, { useState, useRef } from "react";
import { Transition } from "@headlessui/react";

/**
 * Tooltip component with Tailwind styling
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The element that triggers the tooltip
 * @param {string} props.content - The tooltip text content
 * @param {string} [props.placement="top"] - Tooltip placement: "top", "bottom", "left", "right"
 * @param {string} [props.className] - Additional classes for the tooltip
 * @returns {React.ReactElement}
 */
export default function Tooltip({
  children,
  content,
  placement = "top",
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 20);
  };

  const placementClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900",
    left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900",
    right:
      "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <Transition
        show={isVisible}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          className={`absolute z-50 ${placementClasses[placement]} ${className}`}
          role="tooltip"
        >
          <div className="relative">
            <div className="bg-gray-900 text-white rounded py-1 px-2 whitespace-nowrap">
              {content}
            </div>
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[placement]}`}
            />
          </div>
        </div>
      </Transition>
    </div>
  );
}
