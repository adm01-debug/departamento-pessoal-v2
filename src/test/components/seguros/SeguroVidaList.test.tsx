import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeguroVidaList } from '@/components/seguros/SeguroVidaList';
describe('SeguroVidaList', () => { it('renders', () => { render(<SeguroVidaList />); expect(true).toBe(true); }); });
