import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
}

const Table = ({ children, className = "", striped = false, ...props }: TableProps) => {
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
