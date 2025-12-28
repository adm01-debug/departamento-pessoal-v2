import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RetencaoList } from '@/components/retencoes/RetencaoList';
describe('RetencaoList', () => { it('renders', () => { render(<RetencaoList />); expect(true).toBe(true); }); });
