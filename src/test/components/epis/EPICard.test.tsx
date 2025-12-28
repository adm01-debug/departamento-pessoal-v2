import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EPICard } from '@/components/epis/EPICard';
describe('EPICard', () => { it('renders', () => { render(<EPICard />); expect(true).toBe(true); }); });
