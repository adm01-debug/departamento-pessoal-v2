import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PontoCard } from '@/components/ponto/PontoCard';
const mockPonto = { id: '1', colaborador: 'João', data: '2025-01-01', entrada: '08:00', saida: '17:00' };
describe('PontoCard', () => { it('renderiza ponto', () => { render(<PontoCard ponto={mockPonto} />); expect(screen.getByText('João')).toBeInTheDocument(); }); });
