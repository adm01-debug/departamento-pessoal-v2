import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from '@/components/ui/breadcrumb';
describe('Breadcrumb', () => {
  it('renderiza breadcrumb', () => { render(<Breadcrumb><span>Home</span><span>Page</span></Breadcrumb>); expect(screen.getByText('Home')).toBeInTheDocument(); });
});
