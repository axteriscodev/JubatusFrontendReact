import React from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'error'> {
  error?: boolean;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
