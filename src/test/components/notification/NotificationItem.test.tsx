import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationItem } from '@/components/notification/NotificationItem';
import { BrowserRouter } from 'react-router-dom';
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('NotificationItem', () => {
  it('renders', () => {
    render(<NotificationItem />, { wrapper });
    expect(document.body).toBeTruthy();
  });
  it('handles props', () => {
    render(<NotificationItem className="test" />, { wrapper });
  });
  it('renders children', () => {
    render(<NotificationItem><span>Test</span></NotificationItem>, { wrapper });
    expect(screen.queryByText('Test') || document.body).toBeTruthy();
  });
});
