import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IconButton } from '@/components/buttons/IconButton';
describe('IconButton', () => { it('renderiza botão', () => { render(<IconButton icon="edit" aria-label="Editar" />); expect(screen.getByRole('button')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<IconButton icon="add" onClick={onClick} aria-label="Add" />); fireEvent.click(screen.getByRole('button')); expect(onClick).toHaveBeenCalled(); }); });
