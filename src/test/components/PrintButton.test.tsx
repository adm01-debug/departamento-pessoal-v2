import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PrintButton } from '@/components/buttons/PrintButton';
describe('PrintButton', () => { it('renderiza botão', () => { render(<PrintButton onClick={vi.fn()} />); expect(screen.getByText(/imprimir/i)).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<PrintButton onClick={onClick} />); fireEvent.click(screen.getByText(/imprimir/i)); expect(onClick).toHaveBeenCalled(); }); });
