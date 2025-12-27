import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocumentoUpload } from '@/components/documentos/DocumentoUpload';
describe('DocumentoUpload', () => { it('renderiza upload', () => { render(<DocumentoUpload onUpload={vi.fn()} />); expect(screen.getByText(/arraste/i)).toBeInTheDocument(); }); });
