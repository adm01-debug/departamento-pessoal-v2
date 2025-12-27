import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventoESocialCard } from '@/components/esocial/EventoESocialCard';
const mockEvento = { id: '1', codigo: 'S-1200', descricao: 'Remuneração', status: 'pendente' };
describe('EventoESocialCard', () => { it('renderiza evento', () => { render(<EventoESocialCard evento={mockEvento} />); expect(screen.getByText('S-1200')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<EventoESocialCard evento={mockEvento} onClick={onClick} />); fireEvent.click(screen.getByText('S-1200')); expect(onClick).toHaveBeenCalled(); }); });
