import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChecklistAdmissao } from '@/components/admissao/ChecklistAdmissao';

describe('ChecklistAdmissao', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it('renders correctly', () => {
    render(<ChecklistAdmissao isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on cancel', () => {
    render(<ChecklistAdmissao isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar|fechar/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('submits form data', async () => {
    render(<ChecklistAdmissao isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    const submitBtn = screen.getByRole('button', { name: /salvar|confirmar/i });
    fireEvent.click(submitBtn);
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());
  });

  it('validates required fields', async () => {
    render(<ChecklistAdmissao isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /salvar|confirmar/i }));
    await waitFor(() => expect(screen.getByText(/obrigatório/i)).toBeInTheDocument());
  });

  it('handles loading state', () => {
    render(<ChecklistAdmissao isOpen={true} onClose={mockOnClose} isLoading />);
    expect(screen.getByRole('button', { name: /salvar|confirmar/i })).toBeDisabled();
  });
});
