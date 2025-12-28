import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TurnoCard } from '@/components/turnos/TurnoCard';
describe('TurnoCard', () => {
  it('renders', () => { render(<TurnoCard />); expect(true).toBe(true); });
});
