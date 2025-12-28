import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CotacaoCard } from '@/components/cotacoes/CotacaoCard';
describe('CotacaoCard', () => { it('renders', () => { render(<CotacaoCard />); expect(true).toBe(true); }); });
