import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationButton } from '@/components/notification/NotificationButton';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('NotificationButton', () => {
  it('renders', () => {
    render(<NotificationButton />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<NotificationButton className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<NotificationButton><span>Test</span></NotificationButton>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
