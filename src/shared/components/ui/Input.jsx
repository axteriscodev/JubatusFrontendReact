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
      "form-control w-full px-3 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-event/50 disabled:opacity-50 disabled:cursor-not-allowed";

    const stateClasses = error
      ? "border-danger text-danger focus:border-danger"
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
