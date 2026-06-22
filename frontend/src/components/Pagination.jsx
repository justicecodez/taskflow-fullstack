import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6 rounded-b-lg shadow-sm">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{lastPage}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="secondary"
              className="rounded-r-none focus:z-20"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            
            {/* Simple page numbers */}
            {[...Array(lastPage)].map((_, i) => {
              const page = i + 1;
              // Show limited pages: first, last, and around current
              if (
                page === 1 || 
                page === lastPage || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 border ${
                      currentPage === page
                        ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 border-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              // Show ellipses
              if (
                (page === currentPage - 2 && page > 1) || 
                (page === currentPage + 2 && page < lastPage)
              ) {
                return (
                  <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-none">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <Button
              variant="secondary"
              className="rounded-l-none focus:z-20"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= lastPage}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};
