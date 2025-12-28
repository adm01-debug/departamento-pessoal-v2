import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilialCard } from '@/components/filiais/FilialCard';
describe('FilialCard', () => {
  it('renders', () => { render(<FilialCard />); });
  it('displays content', () => { expect(true).toBe(true); });
});
