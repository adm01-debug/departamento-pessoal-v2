import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SummaryCard } from '@/components/cards/SummaryCard';
describe('SummaryCard', () => { it('renderiza card', () => { render(<SummaryCard title="Total" value="1000" />); expect(screen.getByText('Total')).toBeInTheDocument(); expect(screen.getByText('1000')).toBeInTheDocument(); }); });
