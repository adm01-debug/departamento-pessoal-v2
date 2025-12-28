import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { JornadaList } from '@/components/jornadas/JornadaList';
describe('JornadaList', () => {
  it('renders', () => { render(<JornadaList />); expect(true).toBe(true); });
});
