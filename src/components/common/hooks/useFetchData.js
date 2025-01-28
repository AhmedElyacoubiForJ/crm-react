import { useState, useEffect, useCallback } from "react";

/**
 * Custom Hook to fetch data from an API.
 * @param {Function} fetchFunction - The function that fetches data from the API.
 * @param {Array} deps - The dependencies array for useCallback, to memoize the fetch function.
 * @returns {Object} - Returns the fetched data, loading state, and error state.
 */
const useFetchData = (fetchFunction, deps = []) => {
  // State to store the fetched data
  const [data, setData] = useState(null);

  // State to track loading status
  const [loading, setLoading] = useState(true);

  // State to store any error that occurs during fetching
  const [error, setError] = useState(null);

  // Memoize the fetch function to avoid re-executing useEffect unnecessarily
  const stableFetchFunction = useCallback(fetchFunction, deps);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const response = await stableFetchFunction(); // Call the fetch function
        setData(response.data); // Set the fetched data in state
      } catch (err) {
        setError("Fehler beim Abrufen der Daten."); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchData(); // Execute the fetch data function
  }, [stableFetchFunction]); // Dependencies array for useEffect

  // Return the fetched data, loading status, and error message
  return { data, loading, error };
};

export default useFetchData;
