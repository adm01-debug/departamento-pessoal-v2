import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HoleriteCard } from '@/components/folha/HoleriteCard';
const mockHolerite = { id: '1', competencia: '01/2025', colaborador: 'João', bruto: 5000, liquido: 4000 };
describe('HoleriteCard', () => { it('renderiza holerite', () => { render(<HoleriteCard holerite={mockHolerite} />); expect(screen.getByText('João')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<HoleriteCard holerite={mockHolerite} onClick={onClick} />); fireEvent.click(screen.getByText('João')); expect(onClick).toHaveBeenCalled(); }); });
