/**
 * Row and Col components for grid layout (Bootstrap replacement)
 */

export const Row = ({ children, className = '', ...props }) => {
  return (
    <div className={`flex flex-wrap -mx-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const Col = ({ children, className = '', xs, sm, md, lg, xl, ...props }) => {
  // Map Bootstrap column sizes to Tailwind classes
  const colClasses = [];

  if (xs) colClasses.push(`w-full`);
  if (sm) colClasses.push(`sm:w-${sm}/12`);
  if (md) colClasses.push(`md:w-${md}/12`);
  if (lg) colClasses.push(`lg:w-${lg}/12`);
  if (xl) colClasses.push(`xl:w-${xl}/12`);

  return (
    <div className={`px-2 ${colClasses.join(' ')} ${className}`} {...props}>
      {children}
    </div>
  );
};
