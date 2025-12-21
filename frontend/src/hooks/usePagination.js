import { useState, useEffect } from 'react';
import { PAGINATION } from '../utils/constants';

export const usePagination = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = async (page = currentPage, size = pageSize) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFunction(page, size);
      
      if (response && typeof response === 'object') {
        // Handle paginated response
        if (response.content) {
          setData(response.content);
          setTotalPages(response.totalPages || 0);
          setTotalItems(response.totalElements || response.total || 0);
        } else {
          // Handle non-paginated response
          setData(Array.isArray(response) ? response : []);
        }
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize, ...dependencies]);

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const changePageSize = (size) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const refresh = () => {
    fetchData(currentPage, pageSize);
  };

  return {
    data,
    loading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    goToPage,
    changePageSize,
    nextPage,
    previousPage,
    refresh,
  };
};

export default usePagination;

