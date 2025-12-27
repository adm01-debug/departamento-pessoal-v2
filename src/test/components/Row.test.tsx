import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Row } from '@/components/layout/Row';
describe('Row', () => { it('renderiza row', () => { render(<Row>Conteúdo</Row>); expect(screen.getByText('Conteúdo')).toBeInTheDocument(); }); it('aplica gap', () => { const { container } = render(<Row gap={4}>Content</Row>); expect(container.firstChild).toBeInTheDocument(); }); });
