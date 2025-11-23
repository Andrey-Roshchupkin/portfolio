import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state with value from localStorage or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      // Handle boolean values stored as strings
      if (typeof initialValue === 'boolean') {
        return (item === 'true') as T;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (storedValue === null || storedValue === undefined) {
          window.localStorage.removeItem(key);
        } else if (typeof storedValue === 'boolean') {
          // Store boolean as string for consistency
          window.localStorage.setItem(key, String(storedValue));
        } else {
          window.localStorage.setItem(key, JSON.stringify(storedValue));
        }
      } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
      }
    }
  }, [key, storedValue]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        return newValue;
      });
    } catch (error) {
      console.error(`Failed to set ${key} in localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

