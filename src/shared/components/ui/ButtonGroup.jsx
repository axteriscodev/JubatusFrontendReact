/**
 * ButtonGroup component - Groups buttons together
 */
const ButtonGroup = ({ children, className = "", ...props }) => {
  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`} role="group" {...props}>
      {children}
    </div>
  );
};

export default ButtonGroup;
