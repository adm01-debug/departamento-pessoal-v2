import { memo, ComponentType } from 'react';
export function withMemo<P extends object>(Component: ComponentType<P>, propsAreEqual?: (prev: P, next: P) => boolean) {
  return memo(Component, propsAreEqual);
}
