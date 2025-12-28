import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SugestaoList } from '@/components/sugestoes/SugestaoList';
describe('SugestaoList', () => { it('renders', () => { render(<SugestaoList />); expect(true).toBe(true); }); });
