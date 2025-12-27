import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toast } from '@/components/feedback/Toast';
describe('Toast', () => { it('renderiza toast', () => { render(<Toast message="Sucesso!" type="success" />); expect(screen.getByText('Sucesso!')).toBeInTheDocument(); }); it('fecha toast', () => { const onClose = vi.fn(); render(<Toast message="X" type="info" onClose={onClose} />); fireEvent.click(screen.getByRole('button')); expect(onClose).toHaveBeenCalled(); }); });
