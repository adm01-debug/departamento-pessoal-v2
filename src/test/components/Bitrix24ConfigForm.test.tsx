import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Bitrix24ConfigForm } from '@/components/integracoes/Bitrix24ConfigForm';
describe('Bitrix24ConfigForm', () => {
  it('renderiza formulário', () => { render(<Bitrix24ConfigForm onSubmit={vi.fn()} />); expect(screen.getByLabelText(/webhook/i)).toBeInTheDocument(); });
  it('submete formulário', () => { const onSubmit = vi.fn(); render(<Bitrix24ConfigForm onSubmit={onSubmit} />); fireEvent.click(screen.getByText(/salvar/i)); });
});
