import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConfigCard } from '@/components/configuracoes/ConfigCard';
describe('ConfigCard', () => { it('renderiza card', () => { render(<ConfigCard title="Geral" description="Config gerais" />); expect(screen.getByText('Geral')).toBeInTheDocument(); }); });
