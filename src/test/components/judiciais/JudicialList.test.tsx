import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { JudicialList } from '@/components/judiciais/JudicialList';
describe('JudicialList', () => { it('renders', () => { render(<JudicialList />); expect(true).toBe(true); }); });
