import { Children, cloneElement, isValidElement, ReactElement } from 'react';
interface StaggerProps { children: React.ReactNode; delay?: number; }
export function Stagger({ children, delay = 100 }: StaggerProps) {
  return <>{Children.map(children, (child, i) => isValidElement(child) ? cloneElement(child as ReactElement<any>, { style: { ...((child as ReactElement<any>).props.style || {}), animationDelay: `${i * delay}ms` } }) : child)}</>;
}
