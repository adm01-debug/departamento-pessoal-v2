import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContaBancariaList } from '@/components/contas/ContaBancariaList';
describe('ContaBancariaList', () => { it('renders', () => { render(<ContaBancariaList />); expect(true).toBe(true); }); });
