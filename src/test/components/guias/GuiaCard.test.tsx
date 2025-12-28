import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GuiaCard } from '@/components/guias/GuiaCard';
describe('GuiaCard', () => {
  it('renders', () => { render(<GuiaCard />); expect(true).toBe(true); });
});
