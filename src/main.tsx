import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from "@sentry/react";
import { QueryProvider, ThemeProvider, ToastProvider } from '@/providers';
import { AuthProvider, NotificationProvider, EmpresaProvider } from '@/contexts';
import { ErrorBoundary } from '@/errors';
import App from './App';
import './index.css';

Sentry.init({
  dsn: "https://example-dsn@sentry.io/example", // In production this would be an env var
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// PWA Service Worker Registration
const isInIframe = (() => {
  try { return window.self !== window.top; } catch (e) { return true; }
})();

const isPreviewHost = 
  window.location.hostname.includes("id-preview--") || 
  window.location.hostname.includes("lovableproject.com");

if (!isInIframe && !isPreviewHost && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw-custom.js')
      .then(reg => console.log('Service Worker registrado com sucesso:', reg.scope))
      .catch(err => console.error('Falha ao registrar Service Worker:', err));
  });
}

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
