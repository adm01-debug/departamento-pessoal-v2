import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReciboValeTransporte } from '@/components/documentos/ReciboValeTransporte';
const mockData = { colaborador: 'João', competencia: '01/2025', valor: 300 };
describe('ReciboValeTransporte', () => { it('renderiza recibo', () => { render(<ReciboValeTransporte data={mockData} />); expect(screen.getByText('João')).toBeInTheDocument(); }); });
