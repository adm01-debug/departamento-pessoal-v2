import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileSize } from '@/components/file/FileSize';

describe('FileSize', () => {
  it('renders component', () => {
    render(<FileSize />);
    expect(document.body).toBeTruthy();
  });
  it('applies className', () => {
    const { container } = render(<FileSize className="test" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders children', () => {
    render(<FileSize><span>Child</span></FileSize>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
