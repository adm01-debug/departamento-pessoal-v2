import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DropdownItem } from '@/components/dropdown/DropdownItem';
describe('DropdownItem', () => { it('renderiza item', () => { render(<DropdownItem>Opção</DropdownItem>); expect(screen.getByText('Opção')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<DropdownItem onClick={onClick}>Click</DropdownItem>); fireEvent.click(screen.getByText('Click')); expect(onClick).toHaveBeenCalled(); }); });
