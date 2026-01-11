// src/mocks/browser.ts - MSW browser worker for dev
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
