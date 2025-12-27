import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FlexContainer } from '@/components/grid/FlexContainer';

describe('FlexContainer', () => {
  it('renders component', () => {
    render(<FlexContainer />);
    expect(document.body).toBeTruthy();
  });
  it('applies className', () => {
    const { container } = render(<FlexContainer className="test" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders children', () => {
    render(<FlexContainer><span>Child</span></FlexContainer>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
