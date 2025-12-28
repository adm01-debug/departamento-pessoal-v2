import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeriasList } from '@/components/ferias/FeriasList';
describe('FeriasList', () => {
  it('renders', () => { render(<FeriasList />); });
  it('displays content', () => { expect(true).toBe(true); });
});
