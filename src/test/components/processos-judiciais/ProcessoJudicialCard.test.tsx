import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProcessoJudicialCard } from '@/components/processos-judiciais/ProcessoJudicialCard';
describe('ProcessoJudicialCard', () => { it('renders', () => { render(<ProcessoJudicialCard />); expect(true).toBe(true); }); });
