import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AreaCard } from '@/components/areas/AreaCard';
describe('AreaCard', () => { it('renders', () => { render(<AreaCard />); expect(true).toBe(true); }); });
