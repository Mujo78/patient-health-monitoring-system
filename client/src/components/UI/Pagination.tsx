import { Button } from "flowbite-react";
import React, { useState } from "react";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";

type Props = {
  page: number;
  totalPages: number;
  handleNavigate: (page: number) => void;
  className?: string;
};

const Pagination: React.FC<Props> = ({
  page,
  totalPages,
  handleNavigate,
  className,
}) => {
  const [pageNum, setPageNum] = useState<number>(page || 1);

  const handlePageChange = (newPage: number) => {
    setPageNum(newPage);
    handleNavigate(newPage);
  };

  const pageRange = 5;
  const startPage = Math.max(1, pageNum - pageRange);
  const endPage = Math.min(totalPages, pageNum + pageRange);

  const pagesToDisplay = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div
      className={`flex items-center ${className} w-full mt-auto bg-white px-4 py-3 sm:px-6`}
    >
      <div className="flex-1">
        <nav
          className="relative w-full justify-between z-0 inline-flex -space-x-px"
          aria-label="Pagination"
        >
          <div className="w-2/12">
            {pageNum > 1 && (
              <Button
                onClick={() => handlePageChange(pageNum - 1)}
                className="relative inline-flex items-center  active:!bg-transparent active:ring-1 active:ring-indigo-100 text-gray-700 bg-white hover:!bg-gray-50"
              >
                <HiArrowLongLeft className="xxl:!text-2xl" />
              </Button>
            )}
          </div>
          <div className="flex justify-center gap-2 items-center">
            {pagesToDisplay.map((pageNumber) => (
              <Button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`relative inline-flex items-center mx-auto justify-center rounded-lg text-sm hover:!bg-indigo-100 active:!bg-indigo-100 active:ring-1 active:ring-indigo-100 font-medium ${
                  pageNumber === pageNum
                    ? "text-blue-600 bg-indigo-100"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                <p className=" xxl:!text-2xl">{pageNumber}</p>
              </Button>
            ))}
          </div>
          <div className="flex justify-end w-2/12">
            {pageNum < totalPages && (
              <Button
                onClick={() => handlePageChange(pageNum + 1)}
                className="relative inline-flex items-center  active:!bg-transparent active:ring-1 active:ring-indigo-100 text-gray-700 bg-white hover:!bg-gray-50"
              >
                <HiArrowLongRight className="xxl:!text-2xl" />
              </Button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
