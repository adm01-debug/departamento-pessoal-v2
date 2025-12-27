import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IntegracaoConfig } from '@/components/integracoes/IntegracaoConfig';
describe('IntegracaoConfig', () => { it('renderiza config', () => { render(<IntegracaoConfig onSave={vi.fn()} />); expect(screen.getByText(/configuração/i)).toBeInTheDocument(); }); it('salva config', () => { const onSave = vi.fn(); render(<IntegracaoConfig onSave={onSave} />); fireEvent.click(screen.getByText(/salvar/i)); expect(onSave).toHaveBeenCalled(); }); });
