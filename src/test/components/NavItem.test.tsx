import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavItem } from '@/components/navigation/NavItem';
import { BrowserRouter } from 'react-router-dom';
describe('NavItem', () => { it('renderiza item', () => { render(<BrowserRouter><NavItem to="/test" label="Test" /></BrowserRouter>); expect(screen.getByText('Test')).toBeInTheDocument(); }); });
