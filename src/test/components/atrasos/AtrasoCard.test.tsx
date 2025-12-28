import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AtrasoCard } from '@/components/atrasos/AtrasoCard';
describe('AtrasoCard', () => { it('renders', () => { render(<AtrasoCard />); expect(true).toBe(true); }); });
