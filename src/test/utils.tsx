// V15-357
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
const createTestQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });
export function renderWithProviders(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const queryClient = createTestQueryClient();
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}><BrowserRouter>{children}</BrowserRouter></QueryClientProvider>;
  }
  return { ...render(ui, { wrapper: Wrapper, ...options }), queryClient };
}
export * from '@testing-library/react';
export { renderWithProviders as render };
