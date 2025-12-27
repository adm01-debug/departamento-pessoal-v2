import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuditLogList } from '@/components/auditoria/AuditLogList';
const mockLogs = [{ id: '1', action: 'CREATE', entity: 'User', user: 'Admin', timestamp: '2025-01-01' }];
describe('AuditLogList', () => {
  it('renderiza lista', () => {
    render(<AuditLogList logs={mockLogs} />);
    expect(screen.getByText('CREATE')).toBeInTheDocument();
  });
  it('exibe vazio', () => {
    render(<AuditLogList logs={[]} />);
    expect(screen.getByText(/nenhum registro/i)).toBeInTheDocument();
  });
});
