import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Notification } from '@/components/feedback/Notification';
describe('Notification', () => { it('renderiza notificação', () => { render(<Notification message="Sucesso!" />); expect(screen.getByText('Sucesso!')).toBeInTheDocument(); }); it('fecha notificação', () => { const onClose = vi.fn(); render(<Notification message="X" onClose={onClose} />); fireEvent.click(screen.getByRole('button')); expect(onClose).toHaveBeenCalled(); }); });
