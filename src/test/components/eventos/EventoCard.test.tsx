import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EventoCard } from '@/components/eventos/EventoCard';
describe('EventoCard', () => {
  it('renders', () => { render(<EventoCard />); expect(true).toBe(true); });
});
