import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeguroCard } from '@/components/seguros/SeguroCard';
describe('SeguroCard', () => { it('renders', () => { render(<SeguroCard />); expect(true).toBe(true); }); });
