import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExportButton } from '@/components/buttons/ExportButton';
describe('ExportButton', () => { it('renderiza botão', () => { render(<ExportButton onClick={vi.fn()} />); expect(screen.getByText(/exportar/i)).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<ExportButton onClick={onClick} />); fireEvent.click(screen.getByText(/exportar/i)); expect(onClick).toHaveBeenCalled(); }); });
