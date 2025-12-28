import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SolicitacaoList } from '@/components/solicitacoes/SolicitacaoList';
describe('SolicitacaoList', () => { it('renders', () => { render(<SolicitacaoList />); expect(true).toBe(true); }); });
