/**
 * ButtonGroup component - Groups buttons together
 */
const ButtonGroup = ({ children, className = "", ...props }) => {
  return (
    <div className={`button-group isolate inline-flex ${className}`} {...props}>
      {children}
    </div>
  );
};

export default ButtonGroup;
