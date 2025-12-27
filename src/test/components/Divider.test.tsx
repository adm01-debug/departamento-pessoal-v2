import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Divider } from '@/components/layout/Divider';
describe('Divider', () => { it('renderiza divisor', () => { const { container } = render(<Divider />); expect(container.querySelector('hr')).toBeInTheDocument(); }); it('aplica orientação', () => { const { container } = render(<Divider orientation="vertical" />); expect(container.firstChild).toBeInTheDocument(); }); });
