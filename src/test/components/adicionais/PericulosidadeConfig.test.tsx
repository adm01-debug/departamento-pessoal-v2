import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PericulosidadeConfig } from '@/components/adicionais/PericulosidadeConfig';

describe('PericulosidadeConfig', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it('renders form correctly', () => {
    render(<PericulosidadeConfig onSave={mockOnSave} />);
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<PericulosidadeConfig onSave={mockOnSave} />);
    const submitBtn = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitBtn);
    await waitFor(() => expect(mockOnSave).toHaveBeenCalled());
  });

  it('validates required fields', async () => {
    render(<PericulosidadeConfig onSave={mockOnSave} />);
    const submitBtn = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitBtn);
    await waitFor(() => expect(screen.getByText(/obrigatório/i)).toBeInTheDocument());
  });

  it('loads initial data', () => {
    const initialData = { valor: 100 };
    render(<PericulosidadeConfig onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
  });

  it('calculates values correctly', () => {
    render(<PericulosidadeConfig onSave={mockOnSave} />);
    const input = screen.getByLabelText(/valor/i);
    fireEvent.change(input, { target: { value: '1000' } });
    expect(screen.getByText(/R$/)).toBeInTheDocument();
  });
});
