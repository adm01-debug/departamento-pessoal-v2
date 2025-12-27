import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExportModal } from '@/components/export/ExportModal';
describe('ExportModal', () => { it('renderiza modal', () => { render(<ExportModal isOpen onClose={vi.fn()} onExport={vi.fn()} />); expect(screen.getByText(/exportar/i)).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<ExportModal isOpen onClose={onClose} onExport={vi.fn()} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
