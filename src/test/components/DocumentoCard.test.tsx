import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocumentoCard } from '@/components/documentos/DocumentoCard';
const mockDoc = { id: '1', nome: 'RG.pdf', tipo: 'pdf', data: '2025-01-01' };
describe('DocumentoCard', () => { it('renderiza documento', () => { render(<DocumentoCard documento={mockDoc} />); expect(screen.getByText('RG.pdf')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<DocumentoCard documento={mockDoc} onClick={onClick} />); fireEvent.click(screen.getByText('RG.pdf')); expect(onClick).toHaveBeenCalled(); }); });
