import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DropdownSeparator } from '@/components/dropdown/DropdownSeparator';
describe('DropdownSeparator', () => { it('renderiza separador', () => { const { container } = render(<DropdownSeparator />); expect(container.firstChild).toBeInTheDocument(); }); });
