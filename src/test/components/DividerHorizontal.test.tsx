import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DividerHorizontal } from '@/components/layout/DividerHorizontal';
describe('DividerHorizontal', () => { it('renderiza divisor horizontal', () => { const { container } = render(<DividerHorizontal />); expect(container.querySelector('hr')).toBeInTheDocument(); }); });
