import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '@/components/layout/Footer';
describe('Footer', () => { it('renderiza footer', () => { render(<Footer />); expect(screen.getByRole('contentinfo')).toBeInTheDocument(); }); it('exibe copyright', () => { render(<Footer />); expect(screen.getByText(/2025/)).toBeInTheDocument(); }); });
