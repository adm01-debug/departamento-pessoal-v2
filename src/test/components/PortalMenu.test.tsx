import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PortalMenu } from '@/components/portal/PortalMenu';
import { BrowserRouter } from 'react-router-dom';
describe('PortalMenu', () => { it('renderiza menu', () => { render(<BrowserRouter><PortalMenu /></BrowserRouter>); expect(screen.getByRole('navigation')).toBeInTheDocument(); }); });
