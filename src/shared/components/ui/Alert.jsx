import { X } from "lucide-react";

/**
 * Alert component for notifications
 */
const Alert = ({ variant = "info", children, className = "", onDismiss, ...props }) => {
  const variantClasses = {
    info: "bg-blue-100 text-blue-800 border-blue-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div
      className={`p-4 mb-4 rounded-lg border ${variantClasses[variant]} ${onDismiss ? "flex justify-between items-center" : ""} ${className}`}
      role="alert"
      {...props}
    >
      <span>{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
