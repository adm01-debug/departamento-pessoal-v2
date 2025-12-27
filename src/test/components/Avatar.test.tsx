import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from '@/components/ui/avatar';
describe('Avatar', () => {
  it('renderiza avatar', () => {
    render(<Avatar><img src="test.jpg" alt="User" /></Avatar>);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  it('aplica className', () => {
    const { container } = render(<Avatar className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });
});
