import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1 && !onPageSizeChange) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 bg-white border border-gray-200 rounded-lg">
      {/* Info Section */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> entries
      </div>

      {/* Controls Section */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border transition-all duration-200
            ${
              currentPage === 1
                ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                : 'border-emerald-600 text-emerald-600 bg-white hover:bg-emerald-50 hover:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {(() => {
            const pageNumbers = getPageNumbers();
            const showFirstPage = pageNumbers[0] > 1;
            const showLastPage = pageNumbers[pageNumbers.length - 1] < totalPages;

            return (
              <>
                {/* First page button with ellipsis */}
                {showFirstPage && (
                  <>
                    <button
                      onClick={() => onPageChange(1)}
                      className={`
                        min-w-[2.5rem] h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200
                        ${
                          currentPage === 1
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1'
                        }
                      `}
                    >
                      1
                    </button>
                    {pageNumbers[0] > 2 && (
                      <span className="px-1 text-gray-400">...</span>
                    )}
                  </>
                )}

                {/* Visible page numbers */}
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`
                      min-w-[2.5rem] h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200
                      ${
                        currentPage === page
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1'
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                {/* Last page button with ellipsis */}
                {showLastPage && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                      <span className="px-1 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => onPageChange(totalPages)}
                      className={`
                        min-w-[2.5rem] h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200
                        ${
                          currentPage === totalPages
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1'
                        }
                      `}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </>
            );
          })()}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border transition-all duration-200
            ${
              currentPage === totalPages || totalPages === 0
                ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                : 'border-emerald-600 text-emerald-600 bg-white hover:bg-emerald-50 hover:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1'
            }
          `}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Page Size Selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="
              px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
              hover:border-gray-400 transition-all duration-200 cursor-pointer
            "
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
              appearance: 'none',
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;

