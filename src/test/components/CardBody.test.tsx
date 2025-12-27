import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardBody } from '@/components/cards/CardBody';
describe('CardBody', () => {
  it('renderiza conteúdo', () => { render(<CardBody>Conteúdo do card</CardBody>); expect(screen.getByText('Conteúdo do card')).toBeInTheDocument(); });
  it('aplica className', () => { const { container } = render(<CardBody className="body-class">Text</CardBody>); expect(container.firstChild).toHaveClass('body-class'); });
});
