import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavBadge } from '@/components/navigation/NavBadge';
describe('NavBadge', () => { it('renderiza badge', () => { render(<NavBadge count={5} />); expect(screen.getByText('5')).toBeInTheDocument(); }); it('limita máximo', () => { render(<NavBadge count={150} max={99} />); expect(screen.getByText('99+')).toBeInTheDocument(); }); });
