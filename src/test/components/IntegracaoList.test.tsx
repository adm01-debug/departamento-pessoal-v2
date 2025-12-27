import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IntegracaoList } from '@/components/integracoes/IntegracaoList';
const mockIntegracoes = [{ id: '1', nome: 'Int 1' }, { id: '2', nome: 'Int 2' }];
describe('IntegracaoList', () => { it('renderiza lista', () => { render(<IntegracaoList integracoes={mockIntegracoes} />); expect(screen.getByText('Int 1')).toBeInTheDocument(); }); it('exibe vazio', () => { render(<IntegracaoList integracoes={[]} />); expect(screen.getByText(/nenhuma integração/i)).toBeInTheDocument(); }); });
