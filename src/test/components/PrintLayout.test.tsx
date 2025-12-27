import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PrintLayout } from '@/components/print/PrintLayout';
describe('PrintLayout', () => { it('renderiza layout', () => { render(<PrintLayout><div>Conteúdo para impressão</div></PrintLayout>); expect(screen.getByText('Conteúdo para impressão')).toBeInTheDocument(); }); });
