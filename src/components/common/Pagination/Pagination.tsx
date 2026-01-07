import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Previous */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium
            text-gray-700 bg-white border border-gray-300 rounded-lg
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;

            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2)
              pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                  currentPage === pageNum
                    ? "bg-[#eb8b1d] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium
            text-gray-700 bg-white border border-gray-300 rounded-lg
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
