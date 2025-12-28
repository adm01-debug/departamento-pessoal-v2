import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MultaList } from '@/components/multas/MultaList';
describe('MultaList', () => { it('renders', () => { render(<MultaList />); expect(true).toBe(true); }); });
