import { useState, useEffect } from "react";

/**
 * Custom hook that delays updating the returned value until after a specified delay
 * has passed since the last time the input value changed.
 *
 * @param value The fast-updating value (e.g. search input text).
 * @param delay The debounce delay in milliseconds (default: 400ms).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
