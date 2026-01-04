import { useState, useEffect } from "react";
export function useDeferredValuePolyfill<T>(value: T, delay = 300): T {
  const [deferredValue, setDeferredValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDeferredValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return deferredValue;
}
export default useDeferredValuePolyfill;
