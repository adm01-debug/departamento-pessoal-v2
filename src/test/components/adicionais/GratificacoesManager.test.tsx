import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GratificacoesManager } from '@/components/adicionais/GratificacoesManager';

describe('GratificacoesManager', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it('renders form correctly', () => {
    render(<GratificacoesManager onSave={mockOnSave} />);
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<GratificacoesManager onSave={mockOnSave} />);
    const submitBtn = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitBtn);
    await waitFor(() => expect(mockOnSave).toHaveBeenCalled());
  });

  it('validates required fields', async () => {
    render(<GratificacoesManager onSave={mockOnSave} />);
    const submitBtn = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitBtn);
    await waitFor(() => expect(screen.getByText(/obrigatório/i)).toBeInTheDocument());
  });

  it('loads initial data', () => {
    const initialData = { valor: 100 };
    render(<GratificacoesManager onSave={mockOnSave} initialData={initialData} />);
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
  });

  it('calculates values correctly', () => {
    render(<GratificacoesManager onSave={mockOnSave} />);
    const input = screen.getByLabelText(/valor/i);
    fireEvent.change(input, { target: { value: '1000' } });
    expect(screen.getByText(/R$/)).toBeInTheDocument();
  });
});
