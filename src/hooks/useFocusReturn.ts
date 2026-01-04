import { useEffect, useRef } from "react";
export function useFocusReturn(isOpen: boolean) {
  const returnFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (isOpen) { returnFocusRef.current = document.activeElement as HTMLElement; }
    else if (returnFocusRef.current) { returnFocusRef.current.focus(); returnFocusRef.current = null; }
  }, [isOpen]);
  return returnFocusRef;
}
export default useFocusReturn;
