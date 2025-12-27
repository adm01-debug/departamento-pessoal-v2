import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DividerVertical } from '@/components/layout/DividerVertical';
describe('DividerVertical', () => { it('renderiza divisor vertical', () => { const { container } = render(<DividerVertical />); expect(container.firstChild).toBeInTheDocument(); }); });
