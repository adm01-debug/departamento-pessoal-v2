import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MenuIcon } from '@/components/icons/MenuIcon';
describe('MenuIcon', () => { it('renderiza ícone', () => { const { container } = render(<MenuIcon />); expect(container.querySelector('svg')).toBeInTheDocument(); }); });
