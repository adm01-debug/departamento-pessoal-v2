import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GuiaList } from '@/components/guias/GuiaList';
describe('GuiaList', () => {
  it('renders', () => { render(<GuiaList />); expect(true).toBe(true); });
});
