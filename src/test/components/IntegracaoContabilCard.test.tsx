import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IntegracaoContabilCard } from '@/components/contabil/IntegracaoContabilCard';
const mockIntegracao = { id: '1', nome: 'Contábil', status: 'ativo' };
describe('IntegracaoContabilCard', () => { it('renderiza card', () => { render(<IntegracaoContabilCard integracao={mockIntegracao} />); expect(screen.getByText('Contábil')).toBeInTheDocument(); }); });
