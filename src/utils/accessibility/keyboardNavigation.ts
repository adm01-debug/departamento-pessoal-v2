// V20-A11Y003: Keyboard Navigation Utilities
import { useCallback, useEffect } from "react";

type KeyHandler = (event: KeyboardEvent) => void;

export const useKeyboardNavigation = (handlers: Record<string, KeyHandler>) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const handler = handlers[event.key];
      if (handler) {
        handler(event);
      }
    },
    [handlers]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

export const useArrowNavigation = (
  items: HTMLElement[],
  currentIndex: number,
  setCurrentIndex: (index: number) => void
) => {
  useKeyboardNavigation({
    ArrowUp: (e) => {
      e.preventDefault();
      const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      setCurrentIndex(newIndex);
      items[newIndex]?.focus();
    },
    ArrowDown: (e) => {
      e.preventDefault();
      const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);
      items[newIndex]?.focus();
    },
    Home: (e) => {
      e.preventDefault();
      setCurrentIndex(0);
      items[0]?.focus();
    },
    End: (e) => {
      e.preventDefault();
      const lastIndex = items.length - 1;
      setCurrentIndex(lastIndex);
      items[lastIndex]?.focus();
    },
  });
};

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  };

  element.addEventListener("keydown", handleTabKey);
  return () => element.removeEventListener("keydown", handleTabKey);
};

export default useKeyboardNavigation;
