/**
 * Table component - Simple table wrapper
 */
const Table = ({ children, className = "", striped = false, ...props }) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full divide-y divide-gray-200 ${striped ? "table-striped" : ""} ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export default Table;
