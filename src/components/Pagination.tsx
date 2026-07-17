import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { cn } from '../utils/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the start
    if (currentPage <= halfVisible) {
      endPage = Math.min(maxVisiblePages, totalPages);
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add first page and ellipsis
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'p-2 rounded border border-border transition-all duration-150 h-9',
          'hover:bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1',
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'text-text-primary hover:border-primary'
        )}
        aria-label="Previous page"
      >
        <IoChevronBack className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1.5 text-text-muted text-sm"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  'min-w-9 px-3 py-1.5 rounded text-sm font-medium transition-all duration-150 h-9',
                  'focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1',
                  isActive
                    ? 'bg-primary text-secondary font-semibold border border-primary'
                    : 'text-text-secondary hover:bg-background border border-border hover:border-primary hover:text-primary'
                )}
                aria-label={`Page ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'p-2 rounded border border-border transition-all duration-150 h-9',
          'hover:bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1',
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'text-text-primary hover:border-primary'
        )}
        aria-label="Next page"
      >
        <IoChevronForward className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
