import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FeriadoCard } from '@/components/feriados/FeriadoCard';
const mockFeriado = { id: '1', nome: 'Natal', data: '2025-12-25', tipo: 'nacional' };
describe('FeriadoCard', () => { it('renderiza feriado', () => { render(<FeriadoCard feriado={mockFeriado} />); expect(screen.getByText('Natal')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<FeriadoCard feriado={mockFeriado} onClick={onClick} />); fireEvent.click(screen.getByText('Natal')); expect(onClick).toHaveBeenCalled(); }); });
