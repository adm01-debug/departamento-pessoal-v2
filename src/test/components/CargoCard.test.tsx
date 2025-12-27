import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CargoCard } from '@/components/cargos/CargoCard';
const mockCargo = { id: '1', nome: 'Analista', departamento: 'TI', salario: 5000 };
describe('CargoCard', () => { it('renderiza cargo', () => { render(<CargoCard cargo={mockCargo} />); expect(screen.getByText('Analista')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<CargoCard cargo={mockCargo} onClick={onClick} />); fireEvent.click(screen.getByText('Analista')); expect(onClick).toHaveBeenCalled(); }); });
