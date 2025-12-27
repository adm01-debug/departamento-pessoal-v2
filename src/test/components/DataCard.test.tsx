import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataCard } from '@/components/data/DataCard';
describe('DataCard', () => { it('renderiza card', () => { render(<DataCard title="Dados" value="100" />); expect(screen.getByText('Dados')).toBeInTheDocument(); expect(screen.getByText('100')).toBeInTheDocument(); }); });
