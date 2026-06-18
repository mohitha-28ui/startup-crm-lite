import { useState } from "react";

/**
 * Safely reads and parses a value from localStorage.
 *
 * @template T
 * @param {string} key - The localStorage key to read.
 * @param {T} initialValue - Fallback value used when storage is empty, invalid, or unavailable.
 * @returns {T} The parsed stored value, or initialValue when no usable stored value exists.
 */
function readStoredValue(key, initialValue) {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return initialValue;
    }

    const item = window.localStorage.getItem(key);
    return item === null ? initialValue : JSON.parse(item);
  } catch (error) {
    // Private browsing, disabled storage, quota issues, and bad JSON should not break rendering.
    console.warn(`Unable to read "${key}" from localStorage. Using initial value instead.`, error);
    return initialValue;
  }
}

/**
 * React state hook backed by localStorage.
 *
 * The API mirrors useState: it returns the current value and a setter that accepts
 * either the next value or an updater function. Every successful setter call updates
 * React state and attempts to persist the same value to localStorage.
 *
 * @template T
 * @param {string} key - The localStorage key used to persist the value.
 * @param {T} initialValue - Default value used when the key is empty, malformed, or storage is unavailable.
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} A stateful value and setter, matching useState.
 *
 * @example
 * const [leads, setLeads] = useLocalStorage("startup-crm-leads", []);
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => readStoredValue(key, initialValue));

  /**
   * Updates React state and persists the resolved value to localStorage.
   *
   * @param {T|((previousValue: T) => T)} value - Next value or updater function.
   */
  const setValue = (value) => {
    setStoredValue((previousValue) => {
      const valueToStore = value instanceof Function ? value(previousValue) : value;

      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // Keep the UI responsive even when the browser refuses writes to localStorage.
        console.warn(`Unable to save "${key}" to localStorage. State was updated in memory only.`, error);
      }

      return valueToStore;
    });
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
