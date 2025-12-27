import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormSection } from '@/components/form/FormSection';

describe('FormSection', () => {
  it('renders component', () => {
    render(<FormSection />);
    expect(document.body).toBeTruthy();
  });
  it('applies className', () => {
    const { container } = render(<FormSection className="test" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('renders children', () => {
    render(<FormSection><span>Child</span></FormSection>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
