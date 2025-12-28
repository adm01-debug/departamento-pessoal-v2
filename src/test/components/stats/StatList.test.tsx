import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatList } from '@/components/stats/StatList';
describe('StatList', () => { it('renders', () => { render(<StatList />); expect(true).toBe(true); }); });
