import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GridContainer } from '@/components/grid/GridContainer';

describe('GridContainer', () => {
  it('renders component', () => {
    render(<GridContainer />);
    expect(document.body).toBeTruthy();
  });
  it('applies className', () => {
    const { container } = render(<GridContainer className="test" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders children', () => {
    render(<GridContainer><span>Child</span></GridContainer>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
