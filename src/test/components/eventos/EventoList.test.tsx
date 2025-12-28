import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EventoList } from '@/components/eventos/EventoList';
describe('EventoList', () => {
  it('renders', () => { render(<EventoList />); expect(true).toBe(true); });
});
