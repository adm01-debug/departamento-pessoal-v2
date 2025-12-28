import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FaltaList } from '@/components/faltas/FaltaList';
describe('FaltaList', () => { it('renders', () => { render(<FaltaList />); expect(true).toBe(true); }); });
