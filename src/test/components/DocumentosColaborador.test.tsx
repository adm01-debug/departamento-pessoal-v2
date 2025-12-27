import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DocumentosColaborador } from '@/components/documentos/DocumentosColaborador';
const mockDocs = [{ id: '1', nome: 'RG', tipo: 'identificacao' }];
describe('DocumentosColaborador', () => { it('renderiza documentos', () => { render(<DocumentosColaborador documentos={mockDocs} colaboradorId="1" />); expect(screen.getByText('RG')).toBeInTheDocument(); }); });
