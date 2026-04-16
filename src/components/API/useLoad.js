import API from './API.js';
import { useState, useEffect, useMemo } from 'react';

const useLoad = (endpoint, query = '*', filters = []) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  const loadRecords = async (q = query, f = filters) => {
    setIsLoading(true);

    const response = await API.get(endpoint, q, f);

    if (response.isSuccess) {
      setRecords(response.result);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadRecords(query, filters);
  }, [endpoint, query, filterKey]);

  return [records, setRecords, isLoading, loadRecords];
};

export default useLoad;
