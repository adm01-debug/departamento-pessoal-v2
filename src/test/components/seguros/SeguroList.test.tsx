import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeguroList } from '@/components/seguros/SeguroList';
describe('SeguroList', () => { it('renders', () => { render(<SeguroList />); expect(true).toBe(true); }); });
