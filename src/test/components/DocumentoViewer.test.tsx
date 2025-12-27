import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DocumentoViewer } from '@/components/documentos/DocumentoViewer';
describe('DocumentoViewer', () => { it('renderiza viewer', () => { render(<DocumentoViewer url="test.pdf" type="pdf" />); expect(screen.getByRole('document')).toBeInTheDocument(); }); });
