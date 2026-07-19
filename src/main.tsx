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

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

if (import.meta.env.PROD) {
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop;
  console.table = noop;
  console.trace = noop;
}

// Clickjacking defense-in-depth: break out of foreign frames
const isInIframe = (() => {
  try { return window.self !== window.top; } catch (e) { return true; }
})();

const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if (isInIframe && !isPreviewHost) {
  document.body.innerHTML = '';
  if (window.top) window.top.location.href = window.self.location.href;
}

// CSP violation monitoring — detect and report policy breaches client-side
if (import.meta.env.PROD) {
  document.addEventListener('securitypolicyviolation', (e) => {
    const payload = {
      directive: e.violatedDirective,
      blocked: e.blockedURI,
      source: e.sourceFile ? `${e.sourceFile}:${e.lineNumber}` : undefined,
    };
    if (typeof Sentry !== 'undefined' && Sentry.captureMessage) {
      Sentry.captureMessage(`CSP violation: ${e.violatedDirective}`, { level: 'warning', extra: payload });
    }
  });
}

// PWA Service Worker Registration
if (!isInIframe && !isPreviewHost && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw-custom.js')
      .then(reg => { if (import.meta.env.DEV) console.debug('Service Worker registrado:', reg.scope); })
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
