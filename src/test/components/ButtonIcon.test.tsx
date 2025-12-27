import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ButtonIcon } from '@/components/buttons/ButtonIcon';
describe('ButtonIcon', () => {
  it('renderiza botão com ícone', () => { render(<ButtonIcon icon="edit" aria-label="Editar" />); expect(screen.getByRole('button')).toBeInTheDocument(); });
  it('executa onClick', () => { const onClick = vi.fn(); render(<ButtonIcon icon="add" onClick={onClick} aria-label="Add" />); fireEvent.click(screen.getByRole('button')); expect(onClick).toHaveBeenCalled(); });
});
