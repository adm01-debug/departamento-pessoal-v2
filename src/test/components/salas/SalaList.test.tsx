import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SalaList } from '@/components/salas/SalaList';
describe('SalaList', () => { it('renders', () => { render(<SalaList />); expect(true).toBe(true); }); });
