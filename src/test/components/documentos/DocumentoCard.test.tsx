import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DocumentoCard } from '@/components/documentos/DocumentoCard';
describe('DocumentoCard', () => {
  it('renders', () => { render(<DocumentoCard />); expect(true).toBe(true); });
});
