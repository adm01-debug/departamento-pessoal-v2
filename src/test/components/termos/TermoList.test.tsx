import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TermoList } from '@/components/termos/TermoList';
describe('TermoList', () => { it('renders', () => { render(<TermoList />); expect(true).toBe(true); }); });
