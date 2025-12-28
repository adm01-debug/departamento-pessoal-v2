import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HoleriteList } from '@/components/holerites/HoleriteList';
describe('HoleriteList', () => { it('renders', () => { render(<HoleriteList />); expect(true).toBe(true); }); });
