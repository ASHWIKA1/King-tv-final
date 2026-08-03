import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../utils/api';

const CACHE_KEY = 'cached_categories_nav';
const RETRY_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export const useCategoriesNav = () => {
  const [categories, setCategories] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const fetchCategoriesNav = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi('/categories/nav');
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
        setIsError(false);
        setIsFallback(false);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
          console.warn('[useCategoriesNav] Could not write to localStorage cache:', e);
        }
      } else {
        throw new Error('Empty category dataset returned');
      }
    } catch (err) {
      setIsError(true);
      setIsFallback(true);
      if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
        console.warn('[Dev Warning] /categories/nav API call failed. Serving cached/fallback categories.', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesNav();
    const timer = setInterval(fetchCategoriesNav, RETRY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchCategoriesNav]);

  return {
    categories,
    isLoading,
    isError,
    isFallback,
    refetch: fetchCategoriesNav
  };
};
