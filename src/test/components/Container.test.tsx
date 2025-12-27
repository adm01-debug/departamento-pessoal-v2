import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Container } from '@/components/layout/Container';
describe('Container', () => { it('renderiza container', () => { render(<Container>Conteúdo</Container>); expect(screen.getByText('Conteúdo')).toBeInTheDocument(); }); it('aplica max-width', () => { const { container } = render(<Container maxWidth="lg">Content</Container>); expect(container.firstChild).toBeInTheDocument(); }); });
