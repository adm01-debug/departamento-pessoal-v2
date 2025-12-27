import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InformeRendimentos } from '@/components/documentos/InformeRendimentos';
const mockData = { ano: 2024, colaborador: 'João', rendimentos: 60000, irrf: 5000 };
describe('InformeRendimentos', () => { it('renderiza informe', () => { render(<InformeRendimentos data={mockData} />); expect(screen.getByText('João')).toBeInTheDocument(); expect(screen.getByText('2024')).toBeInTheDocument(); }); });
