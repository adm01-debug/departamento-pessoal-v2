import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DropdownTrigger } from '@/components/dropdown/DropdownTrigger';
describe('DropdownTrigger', () => { it('renderiza trigger', () => { render(<DropdownTrigger>Abrir</DropdownTrigger>); expect(screen.getByText('Abrir')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<DropdownTrigger onClick={onClick}>Click</DropdownTrigger>); fireEvent.click(screen.getByText('Click')); expect(onClick).toHaveBeenCalled(); }); });
