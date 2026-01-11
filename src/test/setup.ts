// V15-356
import '@testing-library/jest-dom';
import { vi } from 'vitest';
Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn().mockImplementation(q => ({ matches: false, media: q, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() })) });
window.ResizeObserver = vi.fn().mockImplementation(() => ({ observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }));
