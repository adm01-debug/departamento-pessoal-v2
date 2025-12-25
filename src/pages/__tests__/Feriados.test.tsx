import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Feriados from '../Feriados';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: vi.fn(() => ({ select: vi.fn(() => Promise.resolve({ data: [], error: null })) })) } }));
describe('Feriados', () => { it('should render', () => { const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } }); expect(() => render(<QueryClientProvider client={qc}><BrowserRouter><Feriados /></BrowserRouter></QueryClientProvider>)).not.toThrow(); }); });
