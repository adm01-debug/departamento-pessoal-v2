import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CotacaoList } from '@/components/cotacoes/CotacaoList';
describe('CotacaoList', () => { it('renders', () => { render(<CotacaoList />); expect(true).toBe(true); }); });
