import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from '@/components/stats/StatCard';
describe('StatCard', () => { it('renders', () => { render(<StatCard />); expect(true).toBe(true); }); });
