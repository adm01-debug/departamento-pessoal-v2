import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardTitle } from '@/components/cards/CardTitle';
describe('CardTitle', () => { it('renderiza título', () => { render(<CardTitle>Título</CardTitle>); expect(screen.getByText('Título')).toBeInTheDocument(); }); });
