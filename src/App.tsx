// V15-232: src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { router } from '@/router';
import { AuthProvider, EmpresaProvider, NotificationProvider } from '@/contexts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EmpresaProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
            <Toaster />
          </NotificationProvider>
        </EmpresaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
