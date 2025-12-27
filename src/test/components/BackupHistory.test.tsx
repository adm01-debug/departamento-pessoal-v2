import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BackupHistory } from '@/components/backup/BackupHistory';
const mockHistory = [{ id: '1', date: '2025-01-01', size: '10MB', status: 'completed' }];
describe('BackupHistory', () => {
  it('renderiza histórico', () => { render(<BackupHistory history={mockHistory} />); expect(screen.getByText(/10MB/)).toBeInTheDocument(); });
  it('exibe vazio', () => { render(<BackupHistory history={[]} />); expect(screen.getByText(/nenhum backup/i)).toBeInTheDocument(); });
});
