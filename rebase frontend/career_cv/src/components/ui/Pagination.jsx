import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <div className="flex items-center gap-1">
          {getPageNumbers()[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                1
              </button>
              {getPageNumbers()[0] > 2 && (
                <span className="px-2 text-gray-400">...</span>
              )}
            </>
          )}
          
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg transition ${
                currentPage === page
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                <span className="px-2 text-gray-400">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
