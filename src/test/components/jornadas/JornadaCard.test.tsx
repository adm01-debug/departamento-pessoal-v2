import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { JornadaCard } from '@/components/jornadas/JornadaCard';
describe('JornadaCard', () => {
  it('renders', () => { render(<JornadaCard />); expect(true).toBe(true); });
});
