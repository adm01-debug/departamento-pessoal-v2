import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavIcon } from '@/components/navigation/NavIcon';
describe('NavIcon', () => { it('renderiza ícone', () => { const { container } = render(<NavIcon name="home" />); expect(container.querySelector('svg')).toBeInTheDocument(); }); });
