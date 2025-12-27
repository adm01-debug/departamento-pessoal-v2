import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DocumentoList } from '@/components/documentos/DocumentoList';
const mockDocs = [{ id: '1', nome: 'Doc 1' }, { id: '2', nome: 'Doc 2' }];
describe('DocumentoList', () => { it('renderiza lista', () => { render(<DocumentoList documentos={mockDocs} />); expect(screen.getByText('Doc 1')).toBeInTheDocument(); }); it('exibe vazio', () => { render(<DocumentoList documentos={[]} />); expect(screen.getByText(/nenhum documento/i)).toBeInTheDocument(); }); });
