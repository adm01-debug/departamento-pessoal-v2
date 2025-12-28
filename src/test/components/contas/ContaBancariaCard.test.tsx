import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContaBancariaCard } from '@/components/contas/ContaBancariaCard';
describe('ContaBancariaCard', () => { it('renders', () => { render(<ContaBancariaCard />); expect(true).toBe(true); }); });
