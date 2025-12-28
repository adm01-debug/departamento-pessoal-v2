import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PeritosCard } from '@/components/peritos/PeritosCard';
describe('PeritosCard', () => { it('renders', () => { render(<PeritosCard />); expect(true).toBe(true); }); });
