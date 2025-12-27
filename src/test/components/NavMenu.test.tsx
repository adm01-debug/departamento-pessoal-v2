import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavMenu } from '@/components/navigation/NavMenu';
import { BrowserRouter } from 'react-router-dom';
describe('NavMenu', () => { it('renderiza menu', () => { render(<BrowserRouter><NavMenu items={[{ to: '/home', label: 'Home' }]} /></BrowserRouter>); expect(screen.getByText('Home')).toBeInTheDocument(); }); });
