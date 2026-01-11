// V15-144: src/hooks/useEventListener.ts
import { useEffect, useRef, RefObject } from 'react';

type EventHandler<E extends Event> = (event: E) => void;

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: EventHandler<WindowEventMap[K]>,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement>(
  eventName: K,
  handler: EventHandler<HTMLElementEventMap[K]>,
  element: RefObject<T>,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: EventHandler<DocumentEventMap[K]>,
  element: RefObject<Document>,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  T extends HTMLElement | void
>(
  eventName: KW | KH,
  handler: EventHandler<WindowEventMap[KW] | HTMLElementEventMap[KH] | Event>,
  element?: RefObject<T>,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement: T | Window = element?.current ?? window;
    if (!(targetElement && targetElement.addEventListener)) return;

    const eventListener: EventHandler<Event> = (event) => savedHandler.current(event);
    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}
