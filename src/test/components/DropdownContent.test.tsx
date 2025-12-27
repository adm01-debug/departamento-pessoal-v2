import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DropdownContent } from '@/components/dropdown/DropdownContent';
describe('DropdownContent', () => { it('renderiza conteúdo', () => { render(<DropdownContent>Item</DropdownContent>); expect(screen.getByText('Item')).toBeInTheDocument(); }); });
