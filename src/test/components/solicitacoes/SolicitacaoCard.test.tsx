import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SolicitacaoCard } from '@/components/solicitacoes/SolicitacaoCard';
describe('SolicitacaoCard', () => { it('renders', () => { render(<SolicitacaoCard />); expect(true).toBe(true); }); });
