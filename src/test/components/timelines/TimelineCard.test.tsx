import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimelineCard } from '@/components/timelines/TimelineCard';
describe('TimelineCard', () => { it('renders', () => { render(<TimelineCard />); expect(true).toBe(true); }); });
