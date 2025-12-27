import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardHeader } from '@/components/cards/CardHeader';
describe('CardHeader', () => { it('renderiza header', () => { render(<CardHeader>Header</CardHeader>); expect(screen.getByText('Header')).toBeInTheDocument(); }); });
