// V20-PERF002: Higher Order Component para React.memo
import { memo, ComponentType } from "react";

export function withMemo<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
) {
  return memo(Component, propsAreEqual);
}

// Comparador de props comum
export const shallowEqual = <P extends object>(
  prevProps: Readonly<P>,
  nextProps: Readonly<P>
): boolean => {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  if (prevKeys.length !== nextKeys.length) return false;
  for (const key of prevKeys) {
    if ((prevProps as any)[key] !== (nextProps as any)[key]) return false;
  }
  return true;
};

// Comparador deep para objetos
export const deepEqual = <P extends object>(
  prevProps: Readonly<P>,
  nextProps: Readonly<P>
): boolean => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};
