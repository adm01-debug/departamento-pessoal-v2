import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BadgeContainer } from '@/components/badges/BadgeContainer';
describe('BadgeContainer', () => {
  it('renderiza children', () => { render(<BadgeContainer><span>Badge</span></BadgeContainer>); expect(screen.getByText('Badge')).toBeInTheDocument(); });
  it('aplica className', () => { const { container } = render(<BadgeContainer className="custom">Content</BadgeContainer>); expect(container.firstChild).toHaveClass('custom'); });
});
