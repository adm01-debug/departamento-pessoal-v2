import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BackupStatus } from '@/components/backup/BackupStatus';
describe('BackupStatus', () => {
  it('exibe status sucesso', () => { render(<BackupStatus status="success" />); expect(screen.getByText(/sucesso/i)).toBeInTheDocument(); });
  it('exibe status erro', () => { render(<BackupStatus status="error" />); expect(screen.getByText(/erro/i)).toBeInTheDocument(); });
  it('exibe status pendente', () => { render(<BackupStatus status="pending" />); expect(screen.getByText(/pendente/i)).toBeInTheDocument(); });
});
