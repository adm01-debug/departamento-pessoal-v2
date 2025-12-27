import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImportModal } from '@/components/import/ImportModal';
describe('ImportModal', () => { it('renderiza modal', () => { render(<ImportModal isOpen onClose={vi.fn()} onImport={vi.fn()} />); expect(screen.getByText(/importar/i)).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<ImportModal isOpen onClose={onClose} onImport={vi.fn()} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
