import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfoCard } from '@/components/cards/InfoCard';
describe('InfoCard', () => { it('renderiza card', () => { render(<InfoCard title="Info" value="100" />); expect(screen.getByText('Info')).toBeInTheDocument(); expect(screen.getByText('100')).toBeInTheDocument(); }); it('exibe ícone', () => { const { container } = render(<InfoCard title="X" value="Y" icon="user" />); expect(container.querySelector('svg')).toBeInTheDocument(); }); });
