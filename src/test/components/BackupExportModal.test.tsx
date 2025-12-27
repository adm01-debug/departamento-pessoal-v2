import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BackupExportModal } from '@/components/backup/BackupExportModal';
describe('BackupExportModal', () => {
  it('renderiza modal', () => { render(<BackupExportModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/exportar/i)).toBeInTheDocument(); });
  it('fecha modal', () => { const onClose = vi.fn(); render(<BackupExportModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); });
});
