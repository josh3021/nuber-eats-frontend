import React from 'react';

interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

function Pagination({
  totalPages,
  currentPage,
  onPrevPage,
  onNextPage,
}: IPaginationProps) {
  return (
    <div className="mb-10 grid grid-cols-3 text-center max-w-md items-center mx-auto justify-center">
      {currentPage > 1 ? (
        <div className="hover:bg-gray-200 p-2 rounded-lg">
          <button className="font-medium text-xl" onClick={onPrevPage}>
            &larr; Prev Page
          </button>
        </div>
      ) : (
        <div className="p-2">
          <span className="font-medium text-xl text-gray-400 opacity-50">
            &larr; Prev Page
          </span>
        </div>
      )}
      <span className="m-2 font-medium text-xl">
        {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages ? (
        <div className="hover:bg-gray-200 p-2 rounded-lg">
          <button className="font-medium text-xl" onClick={onNextPage}>
            Next Page &rarr;
          </button>
        </div>
      ) : (
        <div className="p-2">
          <span className="font-medium text-xl text-gray-400 opacity-50">
            Next Page &rarr;
          </span>
        </div>
      )}
    </div>
  );
}

export default Pagination;
