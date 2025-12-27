import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '@/components/ui/checkbox';
describe('Checkbox', () => { it('renderiza checkbox', () => { render(<Checkbox />); expect(screen.getByRole('checkbox')).toBeInTheDocument(); }); it('altera estado', () => { const onCheckedChange = vi.fn(); render(<Checkbox onCheckedChange={onCheckedChange} />); fireEvent.click(screen.getByRole('checkbox')); expect(onCheckedChange).toHaveBeenCalled(); }); });
