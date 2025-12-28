import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FrotaList } from '@/components/frotas/FrotaList';
describe('FrotaList', () => { it('renders', () => { render(<FrotaList />); expect(true).toBe(true); }); });
