import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DropdownMenu } from '@/components/dropdown/DropdownMenu';
describe('DropdownMenu', () => { it('renderiza menu', () => { render(<DropdownMenu trigger={<button>Menu</button>}><div>Item</div></DropdownMenu>); expect(screen.getByText('Menu')).toBeInTheDocument(); }); });
