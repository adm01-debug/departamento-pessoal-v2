import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuditFilter } from '@/components/auditoria/AuditFilter';
describe('AuditFilter', () => {
  it('renderiza filtros', () => {
    render(<AuditFilter onFilter={vi.fn()} />);
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
  });
  it('executa onFilter', () => {
    const onFilter = vi.fn();
    render(<AuditFilter onFilter={onFilter} />);
    fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'teste' } });
    expect(onFilter).toHaveBeenCalled();
  });
});
