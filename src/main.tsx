// V15-441
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider, ThemeProvider, ToastProvider } from '@/providers';
import { AuthProvider, NotificationProvider, EmpresaProvider } from '@/contexts';
import { ErrorBoundary } from '@/errors';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <QueryProvider>
          <BrowserRouter>
            <ThemeProvider>
              <ToastProvider>
                <AuthProvider>
                  <NotificationProvider>
                    <EmpresaProvider>
                      <App />
                    </EmpresaProvider>
                  </NotificationProvider>
                </AuthProvider>
              </ToastProvider>
            </ThemeProvider>
          </BrowserRouter>
        </QueryProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
