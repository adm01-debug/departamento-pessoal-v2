import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EPIList } from '@/components/epis/EPIList';
describe('EPIList', () => { it('renders', () => { render(<EPIList />); expect(true).toBe(true); }); });
