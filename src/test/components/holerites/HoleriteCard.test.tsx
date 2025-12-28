import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HoleriteCard } from '@/components/holerites/HoleriteCard';
describe('HoleriteCard', () => { it('renders', () => { render(<HoleriteCard />); expect(true).toBe(true); }); });
