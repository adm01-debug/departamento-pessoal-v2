import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PontoResumo } from '@/components/ponto/PontoResumo';
const mockResumo = { horasTrabalhadas: 176, horasExtras: 10, faltas: 0 };
describe('PontoResumo', () => { it('renderiza resumo', () => { render(<PontoResumo resumo={mockResumo} />); expect(screen.getByText('176h')).toBeInTheDocument(); }); });
