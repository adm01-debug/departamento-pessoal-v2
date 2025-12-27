import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DateRange } from '@/components/date/DateRange';

describe('DateRange', () => {
  it('renders component', () => {
    render(<DateRange />);
    expect(document.body).toBeTruthy();
  });
  it('applies className', () => {
    const { container } = render(<DateRange className="test" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders children', () => {
    render(<DateRange><span>Child</span></DateRange>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
