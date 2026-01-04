import { useEffect, useRef } from "react";
export function useDocumentTitle(title: string, restoreOnUnmount = true) {
  const previousTitle = useRef(document.title);
  useEffect(() => {
    document.title = title;
    return () => { if (restoreOnUnmount) document.title = previousTitle.current; };
  }, [title, restoreOnUnmount]);
}
export default useDocumentTitle;
