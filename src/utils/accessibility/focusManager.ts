// V20-A11Y004: Focus Management Utilities
import { useRef, useEffect, useCallback } from "react";

export const useFocusReturn = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  return { saveFocus, restoreFocus };
};

export const useFocusOnMount = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, [ref]);
};

export const useModalFocus = (isOpen: boolean, modalRef: React.RefObject<HTMLElement>) => {
  const { saveFocus, restoreFocus } = useFocusReturn();

  useEffect(() => {
    if (isOpen) {
      saveFocus();
      const timer = setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
        );
        firstFocusable?.focus();
      }, 0);
      return () => clearTimeout(timer);
    } else {
      restoreFocus();
    }
  }, [isOpen, modalRef, saveFocus, restoreFocus]);
};

export const announceToScreenReader = (message: string, priority: "polite" | "assertive" = "polite") => {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

export default useFocusReturn;
