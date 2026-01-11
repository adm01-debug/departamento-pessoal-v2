// V15-367
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';
describe('Button', () => {
  it('renders correctly', () => { render(<Button>Click me</Button>); expect(screen.getByRole('button')).toHaveTextContent('Click me'); });
  it('handles click', () => { const onClick = vi.fn(); render(<Button onClick={onClick}>Click</Button>); fireEvent.click(screen.getByRole('button')); expect(onClick).toHaveBeenCalledTimes(1); });
  it('can be disabled', () => { render(<Button disabled>Disabled</Button>); expect(screen.getByRole('button')).toBeDisabled(); });
  it('applies variant classes', () => { render(<Button variant="destructive">Delete</Button>); expect(screen.getByRole('button')).toHaveClass('bg-destructive'); });
});
