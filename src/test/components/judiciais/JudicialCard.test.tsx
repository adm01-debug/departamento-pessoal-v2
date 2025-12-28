import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { JudicialCard } from '@/components/judiciais/JudicialCard';
describe('JudicialCard', () => { it('renders', () => { render(<JudicialCard />); expect(true).toBe(true); }); });
