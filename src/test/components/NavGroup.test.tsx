import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavGroup } from '@/components/navigation/NavGroup';
describe('NavGroup', () => { it('renderiza grupo', () => { render(<NavGroup label="Menu"><div>Item</div></NavGroup>); expect(screen.getByText('Menu')).toBeInTheDocument(); expect(screen.getByText('Item')).toBeInTheDocument(); }); });
