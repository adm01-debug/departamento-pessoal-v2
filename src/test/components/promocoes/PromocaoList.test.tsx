import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PromocaoList } from '@/components/promocoes/PromocaoList';
describe('PromocaoList', () => { it('renders', () => { render(<PromocaoList />); expect(true).toBe(true); }); });
