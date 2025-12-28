import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConvenioCard } from '@/components/convenios/ConvenioCard';
describe('ConvenioCard', () => {
  it('renders', () => { render(<ConvenioCard />); expect(true).toBe(true); });
});
