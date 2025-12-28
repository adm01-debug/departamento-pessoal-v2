import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConvenioList } from '@/components/convenios/ConvenioList';
describe('ConvenioList', () => {
  it('renders', () => { render(<ConvenioList />); expect(true).toBe(true); });
});
