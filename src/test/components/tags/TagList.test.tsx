import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TagList } from '@/components/tags/TagList';
describe('TagList', () => { it('renders', () => { render(<TagList />); expect(true).toBe(true); }); });
