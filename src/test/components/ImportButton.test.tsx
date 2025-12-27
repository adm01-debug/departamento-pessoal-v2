import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImportButton } from '@/components/buttons/ImportButton';
describe('ImportButton', () => { it('renderiza botão', () => { render(<ImportButton onClick={vi.fn()} />); expect(screen.getByText(/importar/i)).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<ImportButton onClick={onClick} />); fireEvent.click(screen.getByText(/importar/i)); expect(onClick).toHaveBeenCalled(); }); });
