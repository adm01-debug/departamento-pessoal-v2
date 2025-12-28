import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DocumentoList } from '@/components/documentos/DocumentoList';
describe('DocumentoList', () => {
  it('renders', () => { render(<DocumentoList />); expect(true).toBe(true); });
});
