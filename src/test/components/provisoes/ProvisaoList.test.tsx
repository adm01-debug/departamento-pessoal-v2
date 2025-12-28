import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProvisaoList } from '@/components/provisoes/ProvisaoList';
describe('ProvisaoList', () => { it('renders', () => { render(<ProvisaoList />); expect(true).toBe(true); }); });
