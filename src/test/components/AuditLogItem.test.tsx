import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuditLogItem } from '@/components/auditoria/AuditLogItem';
const mockLog = { id: '1', action: 'CREATE', entity: 'Colaborador', user: 'Admin', timestamp: '2025-01-01' };
describe('AuditLogItem', () => {
  it('renderiza item de log', () => {
    render(<AuditLogItem log={mockLog} />);
    expect(screen.getByText('CREATE')).toBeInTheDocument();
    expect(screen.getByText('Colaborador')).toBeInTheDocument();
  });
});
