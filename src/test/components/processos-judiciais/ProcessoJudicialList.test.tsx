import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProcessoJudicialList } from '@/components/processos-judiciais/ProcessoJudicialList';
describe('ProcessoJudicialList', () => { it('renders', () => { render(<ProcessoJudicialList />); expect(true).toBe(true); }); });
