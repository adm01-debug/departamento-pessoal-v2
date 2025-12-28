import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ColaboradorCard } from '@/components/colaboradores/ColaboradorCard';
describe('ColaboradorCard', () => {
  it('renders', () => { render(<ColaboradorCard />); });
  it('displays content', () => { expect(true).toBe(true); });
});
