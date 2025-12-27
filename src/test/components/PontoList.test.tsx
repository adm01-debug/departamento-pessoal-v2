import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PontoList } from '@/components/ponto/PontoList';
const mockPontos = [{ id: '1', colaborador: 'João' }, { id: '2', colaborador: 'Maria' }];
describe('PontoList', () => { it('renderiza lista', () => { render(<PontoList pontos={mockPontos} />); expect(screen.getByText('João')).toBeInTheDocument(); }); });
