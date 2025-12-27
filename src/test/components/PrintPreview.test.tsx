import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PrintPreview } from '@/components/print/PrintPreview';
describe('PrintPreview', () => { it('renderiza preview', () => { render(<PrintPreview><div>Preview</div></PrintPreview>); expect(screen.getByText('Preview')).toBeInTheDocument(); }); });
