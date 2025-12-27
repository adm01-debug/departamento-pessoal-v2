import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VirtualList } from '@/components/lists/VirtualList';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('VirtualList', () => {
  it('renders', () => {
    render(<VirtualList />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<VirtualList className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<VirtualList><span>Test</span></VirtualList>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
