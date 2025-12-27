import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocumentoFilter } from '@/components/documentos/DocumentoFilter';
describe('DocumentoFilter', () => { it('renderiza filtros', () => { render(<DocumentoFilter onFilter={vi.fn()} />); expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument(); }); });
