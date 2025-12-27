import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FeriasCard } from '@/components/ferias/FeriasCard';
const mockFerias = { id: '1', colaborador: 'João', inicio: '2025-02-01', fim: '2025-02-15', dias: 14 };
describe('FeriasCard', () => { it('renderiza férias', () => { render(<FeriasCard ferias={mockFerias} />); expect(screen.getByText('João')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<FeriasCard ferias={mockFerias} onClick={onClick} />); fireEvent.click(screen.getByText('João')); expect(onClick).toHaveBeenCalled(); }); });
