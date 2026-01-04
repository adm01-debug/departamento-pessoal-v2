import { useState, useEffect, useCallback } from "react";
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => { try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; } catch { return initialValue; } });
  const setValue = useCallback((value: T | ((val: T) => T)) => { try { const valueToStore = value instanceof Function ? value(storedValue) : value; setStoredValue(valueToStore); window.localStorage.setItem(key, JSON.stringify(valueToStore)); } catch (e) { console.error(e); } }, [key, storedValue]);
  const removeValue = useCallback(() => { try { window.localStorage.removeItem(key); setStoredValue(initialValue); } catch (e) { console.error(e); } }, [key, initialValue]);
  return [storedValue, setValue, removeValue];
}
export default useLocalStorage;
