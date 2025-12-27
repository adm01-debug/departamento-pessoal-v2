import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IntegracaoCard } from '@/components/integracoes/IntegracaoCard';
const mockIntegracao = { id: '1', nome: 'Bitrix24', status: 'ativo', ultimaSync: '2025-01-01' };
describe('IntegracaoCard', () => { it('renderiza integração', () => { render(<IntegracaoCard integracao={mockIntegracao} />); expect(screen.getByText('Bitrix24')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<IntegracaoCard integracao={mockIntegracao} onClick={onClick} />); fireEvent.click(screen.getByText('Bitrix24')); expect(onClick).toHaveBeenCalled(); }); });
