import {useCallback, useState} from 'react';

interface UsePaginationProps {
  totalPage: number;
  initialPage: number;
  fetchFunction: (page: number) => void;
  // setPage: React.Dispatch<React.SetStateAction<number>>;
}

const usePagination = ({
  fetchFunction,
  totalPage,
  initialPage,
}: // setPage
UsePaginationProps): {currentPage: number; handleEndReached: () => void} => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handleEndReached = useCallback(() => {
    if (currentPage < totalPage) {
      fetchFunction(currentPage);
      // setPage(prevPage => prevPage + 1);
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [currentPage, totalPage]);

  return {currentPage, handleEndReached};
};

export default usePagination;
