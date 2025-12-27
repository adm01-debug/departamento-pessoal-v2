import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DeclaracaoVinculo } from '@/components/documentos/DeclaracaoVinculo';
const mockData = { colaborador: 'João', cargo: 'Dev', dataAdmissao: '2020-01-01' };
describe('DeclaracaoVinculo', () => { it('renderiza declaração', () => { render(<DeclaracaoVinculo data={mockData} />); expect(screen.getByText('João')).toBeInTheDocument(); }); });
