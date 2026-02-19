/**
 * InputGroup component - Groups input with addons
 */
const InputGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`flex ${className}`} {...props}>
      {children}
    </div>
  );
};

const InputGroupText = ({ children, className = '', ...props }) => {
  return (
    <span
      className={`inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

InputGroup.Text = InputGroupText;

export default InputGroup;
