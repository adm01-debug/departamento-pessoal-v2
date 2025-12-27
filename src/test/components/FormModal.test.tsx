import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormModal } from '@/components/modals/FormModal';
describe('FormModal', () => { it('renderiza modal', () => { render(<FormModal isOpen title="Form" onClose={vi.fn()}><input /></FormModal>); expect(screen.getByText('Form')).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<FormModal isOpen title="X" onClose={onClose}><div /></FormModal>); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
