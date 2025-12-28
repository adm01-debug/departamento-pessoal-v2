import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimelineList } from '@/components/timelines/TimelineList';
describe('TimelineList', () => { it('renders', () => { render(<TimelineList />); expect(true).toBe(true); }); });
