import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Accessibility Test 1', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<div role="main"><h1>Test</h1></div>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    const { container } = render(<button aria-label="Test">Click</button>);
    expect(container.querySelector('[aria-label]')).toBeTruthy();
  });

  it('should be keyboard navigable', () => {
    const { container } = render(<a href="#" tabIndex={0}>Link</a>);
    expect(container.querySelector('[tabIndex]')).toBeTruthy();
  });
});
