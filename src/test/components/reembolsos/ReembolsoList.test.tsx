import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReembolsoList } from '@/components/reembolsos/ReembolsoList';
describe('ReembolsoList', () => { it('renders', () => { render(<ReembolsoList />); expect(true).toBe(true); }); });
