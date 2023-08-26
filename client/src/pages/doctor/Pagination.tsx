import React, { useState } from 'react'
import {HiArrowLongLeft, HiArrowLongRight} from "react-icons/hi2"
import { Link } from 'react-router-dom'

type Props = {
    page: number,
    totalPages: number,
    handleNavigate: (page: number) => void,
    className?: string
}

const Pagination: React.FC<Props> = ({page, totalPages, handleNavigate, className}) => {

    const [pageNum, setPageNum] = useState<number>(page || 1)

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNum(newPage);
            handleNavigate(newPage)
        }
      };


    const pageRange = 5;
    const startPage = Math.max(1, pageNum - pageRange);
    const endPage = Math.min(totalPages, pageNum + pageRange);

    const pagesToDisplay = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div className={`flex items-center ${className} w-full mt-auto border-t border-gray-200 bg-white px-4 py-3 sm:px-6`}>
      <div className="flex-1">
        <nav className="relative w-full justify-between z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
          <div className='w-2/12'>
            {pageNum > 1 && (
                <Link
                to={`?page=${pageNum - 1}`}
                onClick={() => handlePageChange(pageNum - 1)}
                className="relative inline-flex justify-start items-center px-2 py-2 text-gray-700 bg-white hover:bg-gray-50"
                >
                <HiArrowLongLeft />
                </Link>
            )}
          </div>
          <div className='flex justify-center items-center'>
            {pagesToDisplay.map((pageNumber) => (
                <Link
                key={pageNumber}
                to={`?page=${pageNumber}`}
                onClick={() => handlePageChange(pageNumber)}
                className={`relative inline-flex items-center mx-auto justify-center rounded-lg px-4 py-2 text-sm font-medium ${
                    pageNumber === pageNum
                    ? 'text-blue-600 bg-indigo-100'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
                >
                {pageNumber}
                </Link>
            ))}
          </div>
          <div className='flex justify-end w-2/12'>
            {pageNum < totalPages && (
                <Link
                to={`?page=${ pageNum + 1}`}
                onClick={() => handlePageChange(pageNum + 1)}
                className="relative inline-flex items-center px-2 py-2 text-gray-700 bg-white hover:bg-gray-50"
                >
                <HiArrowLongRight />
                </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Pagination