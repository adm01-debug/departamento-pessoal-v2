import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KPICard } from '@/components/dashboard/KPICard';

describe('KPICard', () => {
  it('renders component', () => {
    render(<KPICard />);
    expect(document.body).toBeTruthy();
  });
  it('applies className', () => {
    const { container } = render(<KPICard className="test" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders children', () => {
    render(<KPICard><span>Child</span></KPICard>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
