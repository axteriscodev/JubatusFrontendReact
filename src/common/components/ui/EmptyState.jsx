const EmptyState = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-500">
        {Icon && <Icon size={48} className="mx-auto" />}
        <p className="mt-3">{title}</p>
        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
  );
};

export default EmptyState;
