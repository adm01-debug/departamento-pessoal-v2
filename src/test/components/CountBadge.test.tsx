import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CountBadge } from '@/components/badges/CountBadge';
describe('CountBadge', () => { it('renderiza contagem', () => { render(<CountBadge count={5} />); expect(screen.getByText('5')).toBeInTheDocument(); }); it('limita máximo', () => { render(<CountBadge count={150} max={99} />); expect(screen.getByText('99+')).toBeInTheDocument(); }); });
