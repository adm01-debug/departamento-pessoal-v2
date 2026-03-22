import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesligamentoFilters } from '../DesligamentoFilters';

describe('DesligamentoFilters', () => {
  const defaultProps = {
    search: '',
    onSearchChange: vi.fn(),
    statusFilter: 'todos',
    onStatusChange: vi.fn(),
    tipoFilter: 'todos',
    onTipoChange: vi.fn(),
  };

  it('renders search input', () => {
    render(<DesligamentoFilters {...defaultProps} />);
    expect(screen.getByPlaceholderText('Buscar por colaborador, motivo...')).toBeInTheDocument();
  });

  it('calls onSearchChange on input', () => {
    render(<DesligamentoFilters {...defaultProps} />);
    const input = screen.getByPlaceholderText('Buscar por colaborador, motivo...');
    fireEvent.change(input, { target: { value: 'João' } });
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('João');
  });

  it('renders with search value', () => {
    render(<DesligamentoFilters {...defaultProps} search="teste" />);
    expect(screen.getByDisplayValue('teste')).toBeInTheDocument();
  });
});
