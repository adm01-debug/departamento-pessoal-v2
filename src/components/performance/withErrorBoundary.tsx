import { Component, ComponentType, ReactNode } from 'react';
interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; }
class ErrorBoundaryClass extends Component<Props, State> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback || <div>Erro</div> : this.props.children; }
}
export function withErrorBoundary<P extends object>(Component: ComponentType<P>, fallback?: ReactNode) {
  return (props: P) => (<ErrorBoundaryClass fallback={fallback}><Component {...props} /></ErrorBoundaryClass>);
}
export { ErrorBoundaryClass as ErrorBoundary };
