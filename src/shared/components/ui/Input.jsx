import React from "react";

/**
 * Input component with Tailwind CSS styling
 * Replaces react-bootstrap Form.Control
 *
 * @param {Object} props
 * @param {string} props.type - Input type (text, email, password, number, etc.)
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.error - Error state for validation
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.name - Input name attribute
 */
const Input = React.forwardRef(
  (
    {
      type = "text",
      value,
      onChange,
      placeholder,
      disabled = false,
      error = false,
      className = "",
      name,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "block w-full rounded-md bg-white text-base px-3 py-2 outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-300 text-black";

    const stateClasses = error
      ? "border-red-500 text-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-secondary-event";

    const inputClasses = `${baseClasses} ${stateClasses} ${className}`;

    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        className={inputClasses}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
