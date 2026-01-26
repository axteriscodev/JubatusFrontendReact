/**
 * Container component for layout
 */
const Container = ({ children, fluid = false, className = '', ...props }) => {
  return (
    <div
      className={`${fluid ? 'w-full' : 'container mx-auto px-4'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
