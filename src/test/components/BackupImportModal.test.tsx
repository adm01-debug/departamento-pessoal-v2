import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BackupImportModal } from '@/components/backup/BackupImportModal';
describe('BackupImportModal', () => {
  it('renderiza modal', () => { render(<BackupImportModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/importar/i)).toBeInTheDocument(); });
  it('fecha modal', () => { const onClose = vi.fn(); render(<BackupImportModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); });
});
