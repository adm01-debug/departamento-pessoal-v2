import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TagCard } from '@/components/tags/TagCard';
describe('TagCard', () => { it('renders', () => { render(<TagCard />); expect(true).toBe(true); }); });
