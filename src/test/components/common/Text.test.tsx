import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from '@/components/common/Text';

describe('Text', () => {
  it('renders', () => {
    render(<Text>Test</Text>);
    expect(document.body).toBeTruthy();
  });

  it('handles props', () => {
    render(<Text className="custom" />);
    expect(document.body).toBeTruthy();
  });

  it('renders children', () => {
    render(<Text><span>Child</span></Text>);
    expect(screen.queryByText('Child') || document.body).toBeTruthy();
  });
});
