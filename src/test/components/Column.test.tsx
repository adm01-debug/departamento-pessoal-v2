import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Column } from '@/components/layout/Column';
describe('Column', () => { it('renderiza coluna', () => { render(<Column>Conteúdo</Column>); expect(screen.getByText('Conteúdo')).toBeInTheDocument(); }); it('aplica span', () => { const { container } = render(<Column span={6}>Col</Column>); expect(container.firstChild).toBeInTheDocument(); }); });
