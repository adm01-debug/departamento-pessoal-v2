import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuditTrail } from '@/components/AuditTrail';

describe('AuditTrail', () => {
  const mockLogs = [
    { id: '1', action: 'CREATE', entity: 'Colaborador', user: 'Admin', timestamp: new Date().toISOString(), details: 'Criado novo colaborador' },
    { id: '2', action: 'UPDATE', entity: 'Cargo', user: 'RH', timestamp: new Date().toISOString(), details: 'Atualizado cargo' },
  ];

  it('renders audit trail component', () => {
    render(<AuditTrail logs={mockLogs} />);
    expect(screen.getByText(/audit/i)).toBeInTheDocument();
  });

  it('displays log entries', () => {
    render(<AuditTrail logs={mockLogs} />);
    expect(screen.getByText(/CREATE/i)).toBeInTheDocument();
    expect(screen.getByText(/UPDATE/i)).toBeInTheDocument();
  });

  it('shows empty state when no logs', () => {
    render(<AuditTrail logs={[]} />);
    expect(screen.getByText(/nenhum registro/i)).toBeInTheDocument();
  });

  it('filters logs by action type', () => {
    render(<AuditTrail logs={mockLogs} filterAction="CREATE" />);
    expect(screen.getByText(/CREATE/i)).toBeInTheDocument();
  });

  it('shows user who performed action', () => {
    render(<AuditTrail logs={mockLogs} />);
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  });
});
