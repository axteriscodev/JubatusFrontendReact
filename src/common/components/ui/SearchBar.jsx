import { Search, XCircle } from "lucide-react";

const SearchBar = ({
  placeholder = "Cerca...",
  searchTerm,
  onSearchChange,
  onClear,
  filteredCount,
  totalCount,
  countLabel = "risultati",
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div className="flex shadow-sm">
        <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
          <Search size={16} className="text-blue-600" />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={onSearchChange}
          className="flex-1 border-2 border-l-0 border-gray-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     rounded-r-md"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={onClear}
            className="px-3 border-2 border-l-0 border-gray-300 text-gray-600
                       hover:bg-gray-100 transition-colors rounded-r-md -ml-px"
          >
            <XCircle size={16} />
          </button>
        )}
      </div>
      <div className="text-right mt-2 md:mt-0 flex items-center justify-end">
        <small className="text-gray-500">
          Visualizzati {filteredCount} di {totalCount} {countLabel}
        </small>
      </div>
    </div>
  );
};

export default SearchBar;
