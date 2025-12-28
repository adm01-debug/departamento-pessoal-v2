import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TurnoList } from '@/components/turnos/TurnoList';
describe('TurnoList', () => {
  it('renders', () => { render(<TurnoList />); expect(true).toBe(true); });
});
